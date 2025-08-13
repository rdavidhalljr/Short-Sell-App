
import type { Candle } from './types';

export async function fetchAlphaVantageDaily(symbol: string): Promise<Candle[]> {
  const key = process.env.ALPHA_VANTAGE_KEY!;
  if (!key) throw new Error('ALPHA_VANTAGE_KEY is missing');
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${key}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);
  const j = await res.json();
  const series = j['Time Series (Daily)'];
  if (!series) throw new Error('Malformed Alpha Vantage response');
  const rows = Object.entries(series).map(([t, ohlc]: any) => ({
    t,
    o: parseFloat(ohlc['1. open']),
    h: parseFloat(ohlc['2. high']),
    l: parseFloat(ohlc['3. low']),
    c: parseFloat(ohlc['4. close']),
    v: parseFloat(ohlc['6. volume']),
  }));
  rows.sort((a, b) => a.t.localeCompare(b.t)); // oldest -> newest
  return rows;
}
