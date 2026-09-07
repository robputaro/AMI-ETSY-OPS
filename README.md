# AMI Etsy Ops v0.1
Standalone private Vercel app for AMI Etsy personalized-book operations.

## Included
- password-gated internal dashboard
- manual/test order entry
- Etsy Seller App OAuth with PKCE
- signed `order.paid` webhook, replay guard, idempotency
- receipt + transaction import and personalization normalization
- missing/ambiguous data review flags
- 14-day paid-order backfill sync
- locked Hidden Door manuscript + live child-name substitution
- static approved-art inventory model
- browser proof view with live text separate from art
- human approval gate before print
- Lulu data boundary staged, not auto-submitted

## Setup
1. Create a separate Supabase project and run `supabase/schema.sql`.
2. Copy `.env.example` to `.env.local`; fill secrets.
3. Create an Etsy Seller App for your shop.
4. Register `https://YOUR-APP.vercel.app/api/etsy/callback` as the redirect URI.
5. Deploy this folder as a NEW Vercel project.
6. Visit `/setup` → Connect Etsy shop.
7. In Etsy Webhook Portal subscribe `order.paid` to `https://YOUR-APP.vercel.app/api/etsy/webhook`.
8. Put the generated `whsec_...` secret in `ETSY_WEBHOOK_SECRET` and redeploy.

Use Etsy structured personalization names like `Child name`, `Character`, and `Dedication`. Etsy transaction personalization can include multiple variation records, so this app does not assume one generic text field.

## Fulfillment target
`Etsy paid → import → review → static art + live text proof → approve → 8.5×8.5 print PDFs → Lulu → tracking back to Etsy`.

v0.1 intentionally defers the Lulu POST until the print PDF pipeline is validated.
