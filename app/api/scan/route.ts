
import { NextResponse } from 'next/server';
import { fetchAlphaVantageDaily } from '@/lib/data';
import { rsi, macd, atr, bollinger, slope, sma } from '@/lib/indicators';
import { getModel, saveModel } from '@/lib/db';
import { defaultParams, predict } from '@/lib/ml';
import type { Recommendation } from '@/lib/types';

function blendScore(prob: number, techScore: number) {
  // Simple convex blend; could be made dynamic.
  return 0.6 * prob + 0.4 * techScore;
}

function positionSizeFromAtr(price: number, atrValue: number) {
  // Naive: risk 1% with stop = 1*ATR
  const accountEquity = 100000;
  const riskPerTrade = 0.01 * accountEquity;
  if (!atrValue || atrValue <= 0) return 0;
  return Math.max(0, Math.min(1000, Math.floor(riskPerTrade / atrValue)));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const universe: string[] = body.universe ?? ['AAPL','MSFT','TSLA','NVDA','AMZN'];
    const modelRow = await getModel('online-lr');
    const params = modelRow?.params ?? defaultParams();

    let best: { sym: string; score: number; rec: Recommendation } | null = null;

    for (const sym of universe) {
      const candles = await fetchAlphaVantageDaily(sym);
      const closes = candles.map(c => c.c);
      const rsi14 = rsi(closes, 14);
      const macdRes = macd(closes);
      const atr14 = atr(candles, 14);
      const bb = bollinger(closes, 20, 2);
      const slope5 = slope(closes, 5);
      const sma20 = sma(closes, 20);

      const i = closes.length - 1;
      const feats: Record<string, number> = {
        rsi: rsi14[i] ?? 50,
        macd: macdRes.macdLine[i] ?? 0,
        macd_hist: macdRes.hist[i] ?? 0,
        z: bb[i]?.z ?? 0,
        slope5: slope5[i] ?? 0,
        dist_sma20: sma20[i] ? (closes[i] - (sma20[i] as number)) / (sma20[i] as number) : 0,
      };

      // normalize some features
      feats.rsi = (feats.rsi - 50) / 50;     // ~[-1,1]
      feats.macd = feats.macd / closes[i];   // scale to price
      feats.macd_hist = feats.macd_hist / closes[i];
      feats.slope5 = feats.slope5 / closes[i];

      const prob = predict(params, feats);

      // crude technical short score: overbought + negative momentum favored
      const tech = (
        (bb[i]?.z ?? 0) > 1.5 ? 0.4 : 0
      ) + ((rsi14[i] ?? 50) > 70 ? 0.3 : 0) + ((macdRes.hist[i] ?? 0) < 0 ? 0.3 : 0);

      const blended = blendScore(prob, tech);
      const projectedGain = Math.min(0.15, Math.max(0.01, blended * 0.1)); // 1% - 15%
      const pos = positionSizeFromAtr(closes[i], atr14[i]);

      const rationale: string[] = [];
      if ((bb[i]?.z ?? 0) > 1.5) rationale.push(`Price above Bollinger mid by ${ (bb[i]!.z).toFixed(2) }σ`);
      if ((rsi14[i] ?? 50) > 70) rationale.push(`RSI=${(rsi14[i] as number).toFixed(1)} (overbought)`);
      if ((macdRes.hist[i] ?? 0) < 0) rationale.push(`MACD histogram negative`);
      rationale.push(`Model p(short)=${(prob*100).toFixed(1)}%`);

      const rec: Recommendation = {
        symbol: sym,
        probability: prob,
        projectedGain,
        positionSize: pos,
        rationale
      };

      if (!best || blended > best.score) {
        best = { sym, score: blended, rec };
      }
    }

    if (!best) throw new Error('No recommendation');

    return NextResponse.json({ recommendation: best.rec });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
