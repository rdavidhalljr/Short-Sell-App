
'use client';

import { useEffect, useState } from 'react';

type Trade = {
  id: number;
  created_at: string;
  symbol: string;
  side: 'SHORT' | 'LONG';
  qty: number;
  entry_price: number | null;
  exit_price: number | null;
  status: 'OPEN' | 'CLOSED';
  meta: any;
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/trades');
    const data = await res.json();
    setTrades(data.trades || []);
    setLoading(false);
  }

  async function closeTrade(id: number) {
    const exit = prompt('Exit price? (leave blank to store null)');
    const res = await fetch(`/api/trades/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CLOSED', exitPrice: exit ? Number(exit) : null })
    });
    if (!res.ok) alert(await res.text()); else load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Paper Trades</h2>
      {loading ? <div>Loading...</div> : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Entry</th><th>Exit</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.symbol}</td>
                <td>{t.side}</td>
                <td>{t.qty}</td>
                <td>{t.entry_price ?? '-'}</td>
                <td>{t.exit_price ?? '-'}</td>
                <td>{t.status}</td>
                <td>{t.status === 'OPEN' && <button className="button" onClick={() => closeTrade(t.id)}>Close</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
