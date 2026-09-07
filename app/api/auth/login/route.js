import { NextResponse } from 'next/server'; import { setSession } from '@/lib/session';
export async function POST(req){const form=await req.formData();if(form.get('password')!==process.env.OPS_PASSWORD)return NextResponse.redirect(new URL('/login?error=1',req.url),303);await setSession();return NextResponse.redirect(new URL('/',req.url),303)}
