
import { NextResponse } from 'next/server';
import { withBootstrap } from '@/lib/bootstrap';

export async function GET() {
  return withBootstrap(async () => NextResponse.json({ ok: true }));
}
