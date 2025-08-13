
import type { Candle } from './types';

export function sma(values: number[], period: number) {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function ema(values: number[], period: number) {
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0];
  out.push(prev);
  for (let i = 1; i < values.length; i++) {
    const v = values[i] * k + prev * (1 - k);
    out.push(v);
    prev = v;
  }
  return out;
}

export function rsi(closes: number[], period = 14) {
  const out: number[] = [];
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i-1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  gains /= period; losses /= period;
  out.push(NaN); // align
  for (let i = period+1; i < closes.length; i++) {
    const diff = closes[i] - closes[i-1];
    if (diff >= 0) { gains = (gains*(period-1) + diff)/period; losses = (losses*(period-1))/period; }
    else { gains = (gains*(period-1))/period; losses = (losses*(period-1) - diff)/period; }
    const rs = losses === 0 ? 100 : gains / losses;
    out.push(100 - 100/(1+rs));
  }
  return Array(period).fill(NaN).concat(out.slice(1));
}

export function macd(closes: number[], fast=12, slow=26, signal=9) {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macdLine = closes.map((_, i) => emaFast[i] - emaSlow[i]);
  const signalLine = ema(macdLine, signal);
  const hist = macdLine.map((v, i) => v - signalLine[i]);
  return { macdLine, signalLine, hist };
}

export function atr(candles: Candle[], period=14) {
  const trs: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) { trs.push(candles[i].h - candles[i].l); continue; }
    const prevClose = candles[i-1].c;
    const tr = Math.max(
      candles[i].h - candles[i].l,
      Math.abs(candles[i].h - prevClose),
      Math.abs(candles[i].l - prevClose)
    );
    trs.push(tr);
  }
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < trs.length; i++) {
    sum += trs[i];
    if (i >= period) sum -= trs[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function bollinger(closes: number[], period=20, mult=2) {
  const ma = sma(closes, period);
  const out = closes.map((_, i) => {
    if (i < period - 1) return { mid: NaN, upper: NaN, lower: NaN, z: NaN };
    const mean = ma[i];
    const slice = closes.slice(i - period + 1, i + 1);
    const variance = slice.reduce((acc, v) => acc + (v - mean) ** 2, 0) / period;
    const sd = Math.sqrt(variance);
    const upper = mean + mult * sd;
    const lower = mean - mult * sd;
    const z = sd === 0 ? 0 : (closes[i] - mean) / sd;
    return { mid: mean, upper, lower, z };
  });
  return out;
}

export function slope(values: number[], period=5) {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(NaN); continue; }
    const y = values.slice(i - period + 1, i + 1);
    const n = y.length;
    const x = Array.from({ length: n }, (_, k) => k+1);
    const xbar = (n+1)/2;
    const ybar = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let k = 0; k < n; k++) { num += (x[k]-xbar)*(y[k]-ybar); den += (x[k]-xbar)**2; }
    out.push(den === 0 ? 0 : num/den);
  }
  return out;
}
