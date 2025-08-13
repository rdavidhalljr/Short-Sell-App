
import { NextResponse } from 'next/server';
import { initSchema } from '@/lib/db';

export async function GET() {
  try {
    await initSchema();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
