
'use client';

import { useEffect, useState } from 'react';

type Recommendation = {
  symbol: string;
  probability: number;
  projectedGain: number;
  positionSize: number;
  rationale: string[];
};

export default function Page() {
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function scan() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universe: [symbol] })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRec(data.recommendation);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function openTrade() {
    if (!rec) return;
    const res = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: rec.symbol, side: 'SHORT', qty: rec.positionSize, entryPrice: null, meta: { probability: rec.probability, projectedGain: rec.projectedGain, rationale: rec.rationale }
      })
    });
    if (!res.ok) alert(await res.text());
    else alert('Trade created.');
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Scan & Recommend</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input className="input" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol e.g. AAPL" />
        <button className="button" onClick={scan} disabled={loading}>{loading ? 'Scanning...' : 'Scan'}</button>
        {rec && <button className="button secondary" onClick={openTrade}>Open Paper Short</button>}
      </div>
      {error && <div style={{ color: '#fca5a5' }}>{error}</div>}
      {rec && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="card">
            <div><span className="badge">Symbol</span> <b>{rec.symbol}</b></div>
            <div><span className="badge">Probability</span> {(rec.probability*100).toFixed(1)}%</div>
            <div><span className="badge">Projected Gain</span> {(rec.projectedGain*100).toFixed(1)}%</div>
            <div><span className="badge">Position Size</span> {rec.positionSize.toFixed(2)}</div>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Rationale</h3>
            <ul>
              {rec.rationale.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}
      {!rec && <p style={{ opacity: 0.8 }}>Enter a symbol or universe and click Scan. The server will fetch data, compute indicators, blend with the online model, and return one actionable short idea.</p>}
    </div>
  );
}
