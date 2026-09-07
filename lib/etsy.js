import crypto from 'crypto';
import { adminDb } from './supabase';

const API = 'https://api.etsy.com/v3/application';
const TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token';

function apiKeyHeader() {
  if (!process.env.ETSY_API_KEY || !process.env.ETSY_SHARED_SECRET) throw new Error('Etsy API credentials missing.');
  return `${process.env.ETSY_API_KEY}:${process.env.ETSY_SHARED_SECRET}`;
}

export function createPkce() {
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const state = crypto.randomBytes(24).toString('hex');
  return { verifier, challenge, state };
}

export function etsyAuthUrl({ challenge, state }) {
  const redirect = process.env.ETSY_REDIRECT_URI || `${process.env.APP_URL}/api/etsy/callback`;
  const q = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirect,
    scope: 'transactions_r transactions_w shops_r',
    client_id: process.env.ETSY_API_KEY,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  return `https://www.etsy.com/oauth/connect?${q.toString()}`;
}

export async function exchangeCode({ code, verifier }) {
  const redirect = process.env.ETSY_REDIRECT_URI || `${process.env.APP_URL}/api/etsy/callback`;
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.ETSY_API_KEY,
    redirect_uri: redirect,
    code,
    code_verifier: verifier,
  });
  const res = await fetch(TOKEN_URL, { method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body, cache: 'no-store' });
  if (!res.ok) throw new Error(`Etsy token exchange failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function refreshToken(connection) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ETSY_API_KEY,
    refresh_token: connection.refresh_token,
  });
  const res = await fetch(TOKEN_URL, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body, cache:'no-store' });
  if (!res.ok) throw new Error(`Etsy refresh failed: ${res.status} ${await res.text()}`);
  const token = await res.json();
  const db = adminDb();
  await db.from('connections').update({
    access_token: token.access_token,
    refresh_token: token.refresh_token || connection.refresh_token,
    expires_at: new Date(Date.now() + (token.expires_in || 3600) * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('provider','etsy');
  return { ...connection, ...token, expires_at: new Date(Date.now() + (token.expires_in || 3600)*1000).toISOString() };
}

export async function getConnection() {
  const db = adminDb();
  const { data, error } = await db.from('connections').select('*').eq('provider','etsy').maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (!data.expires_at || Date.parse(data.expires_at) < Date.now() + 60_000) return refreshToken(data);
  return data;
}

export async function etsyFetch(path, options = {}) {
  const connection = await getConnection();
  if (!connection) throw new Error('Etsy shop is not connected.');
  const res = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
    ...options,
    headers: {
      'x-api-key': apiKeyHeader(),
      Authorization: `Bearer ${connection.access_token}`,
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Etsy API ${res.status}: ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

export async function discoverShop(accessToken) {
  const userId = String(accessToken || '').split('.')[0];
  if (!/^\d+$/.test(userId)) {
    const me = await fetch(`${API}/users/me`, { headers: { 'x-api-key': apiKeyHeader(), Authorization: `Bearer ${accessToken}` }, cache:'no-store' });
    if (!me.ok) throw new Error(`Could not identify Etsy user: ${await me.text()}`);
    const meJson = await me.json();
    return fetchShopForUser(meJson.user_id, accessToken);
  }
  return fetchShopForUser(userId, accessToken);
}

async function fetchShopForUser(userId, accessToken) {
  const res = await fetch(`${API}/users/${userId}/shops`, { headers: { 'x-api-key': apiKeyHeader(), Authorization: `Bearer ${accessToken}` }, cache:'no-store' });
  if (!res.ok) throw new Error(`Could not find Etsy shop: ${await res.text()}`);
  return res.json();
}

export function verifyWebhook({ rawBody, id, timestamp, signature }) {
  const secret = process.env.ETSY_WEBHOOK_SECRET;
  if (!secret) throw new Error('ETSY_WEBHOOK_SECRET is not configured.');
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Math.floor(Date.now()/1000) - ts) > 300) return false;
  const encoded = secret.startsWith('whsec_') ? secret.slice(6) : secret;
  const key = Buffer.from(encoded, 'base64');
  const signed = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', key).update(signed).digest('base64');
  const candidates = String(signature || '').split(/\s+/).map(s => s.replace(/^v\d+,/, '').trim()).filter(Boolean);
  return candidates.some(candidate => {
    try { return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected)); } catch { return false; }
  });
}

function valueFor(variation, patterns) {
  const name = String(variation?.formatted_name || '').toLowerCase();
  return patterns.some(p => name.includes(p)) ? variation?.formatted_value : null;
}

export function normalizeTransaction(tx) {
  const variations = Array.isArray(tx.variations) ? tx.variations : [];
  const personalizations = variations.filter(v => Number(v.property_id) === 54);
  const childName = variations.map(v => valueFor(v, ['child name','name'])).find(Boolean) || personalizations[0]?.formatted_value || '';
  const character = variations.map(v => valueFor(v, ['character','hair','style'])).find(Boolean) || '';
  const dedication = variations.map(v => valueFor(v, ['dedication','message'])).find(Boolean) || personalizations[1]?.formatted_value || '';
  return {
    transaction_id: String(tx.transaction_id || ''),
    listing_id: String(tx.listing_id || ''),
    title: tx.title || '',
    quantity: tx.quantity || 1,
    child_name: childName,
    character_label: character,
    dedication,
    raw_variations: variations,
  };
}

export async function importReceipt(receiptId, resourceUrl) {
  const connection = await getConnection();
  if (!connection?.shop_id) throw new Error('Connected Etsy shop_id missing.');
  const receipt = await etsyFetch(resourceUrl || `/shops/${connection.shop_id}/receipts/${receiptId}`);
  const txs = await etsyFetch(`/shops/${connection.shop_id}/receipts/${receiptId}/transactions`);
  const transactions = (txs?.results || receipt?.transactions || []).map(normalizeTransaction);
  const primary = transactions[0] || {};
  const address = {
    name: receipt.name || '', first_line: receipt.first_line || '', second_line: receipt.second_line || '',
    city: receipt.city || '', state: receipt.state || '', zip: receipt.zip || '', country_iso: receipt.country_iso || ''
  };
  const db = adminDb();
  const payload = {
    source: 'etsy',
    external_order_id: String(receipt.receipt_id || receiptId),
    status: receipt.status === 'canceled' ? 'canceled' : 'new',
    buyer_name: receipt.name || '',
    buyer_email: receipt.buyer_email || '',
    shipping_address: address,
    product_slug: (process.env.ETSY_HIDDEN_DOOR_LISTING_ID && String(primary.listing_id) === String(process.env.ETSY_HIDDEN_DOOR_LISTING_ID)) || primary.title?.toLowerCase().includes('hidden door') ? 'hidden-door' : '',
    child_name: primary.child_name || '',
    character_label: primary.character_label || '',
    dedication: primary.dedication || '',
    quantity: primary.quantity || 1,
    etsy_payload: receipt,
    etsy_transactions: transactions,
    needs_review: !primary.child_name || !primary.character_label || !address.first_line || !(((process.env.ETSY_HIDDEN_DOOR_LISTING_ID && String(primary.listing_id) === String(process.env.ETSY_HIDDEN_DOOR_LISTING_ID)) || primary.title?.toLowerCase().includes('hidden door'))),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await db.from('orders').upsert(payload, { onConflict: 'source,external_order_id' }).select().single();
  if (error) throw error;
  return data;
}
