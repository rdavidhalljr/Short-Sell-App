
import { NextResponse } from 'next/server';
import { withBootstrap } from '@/lib/bootstrap';
import { updateTrade } from '@/lib/db';

export async function PATCH(_: Request, { params }: { params: { id: string }}) {
  try {
    const id = Number(params.id);
    const body = await _.json();
    const updated = await updateTrade(id, { status: body.status, exitPrice: body.exitPrice });
    return NextResponse.json({ trade: updated });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
  ); }
