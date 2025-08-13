
import { NextResponse } from 'next/server';
import { listTrades, createTrade } from '@/lib/db';

export async function GET() {
  try {
    const trades = await listTrades();
    return NextResponse.json({ trades });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const t = await createTrade({
      symbol: body.symbol,
      side: body.side,
      qty: body.qty,
      entryPrice: body.entryPrice ?? null,
      meta: body.meta ?? {}
    });
    return NextResponse.json({ trade: t });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
