
import { NextResponse } from 'next/server';
import { withBootstrap } from '@/lib/bootstrap';
import { getModel, saveModel } from '@/lib/db';
import { defaultParams, sgdUpdate } from '@/lib/ml';

/**
 * Very minimal "online" trainer: caller posts a feature vector + label (1=short worked, 0=failed).
 * Body: { features: Record<string, number>, label: 0|1 }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feats = body.features || {};
    const label = Number(body.label);
    if (!(label === 0 || label === 1)) throw new Error('label must be 0 or 1');

    const modelRow = await getModel('online-lr');
    const params = modelRow?.params ?? defaultParams();
    const updated = sgdUpdate(params, feats, label);
    await saveModel('online-lr', updated);
    return NextResponse.json({ ok: true, params: updated });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
  ); }
