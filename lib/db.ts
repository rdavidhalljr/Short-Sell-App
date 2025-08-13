
import { sql } from '@vercel/postgres';

export async function initSchema() {
  await sql`CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    qty DOUBLE PRECISION NOT NULL,
    entry_price DOUBLE PRECISION,
    exit_price DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'OPEN',
    meta JSONB
  );`;

  await sql`CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT UNIQUE NOT NULL,
    params JSONB NOT NULL
  );`;
}

export async function getModel(name: string) {
  const { rows } = await sql`SELECT * FROM models WHERE name = ${name} LIMIT 1;`;
  return rows[0] || null;
}

export async function saveModel(name: string, params: any) {
  await sql`INSERT INTO models (name, params)
    VALUES (${name}, ${params}::jsonb)
    ON CONFLICT (name) DO UPDATE SET params = EXCLUDED.params;`;
}

export async function listTrades() {
  const { rows } = await sql`SELECT * FROM trades ORDER BY id DESC;`;
  return rows;
}

export async function createTrade(t: { symbol: string; side: string; qty: number; entryPrice: number | null; meta: any; }) {
  const { rows } = await sql`INSERT INTO trades (symbol, side, qty, entry_price, meta) VALUES (
    ${t.symbol}, ${t.side}, ${t.qty}, ${t.entryPrice}, ${t.meta}::jsonb
  ) RETURNING *;`;
  return rows[0];
}

export async function updateTrade(id: number, patch: { status?: string; exitPrice?: number | null; }) {
  const { rows } = await sql`UPDATE trades
    SET status = COALESCE(${patch.status}, status),
        exit_price = COALESCE(${patch.exitPrice}, exit_price)
    WHERE id = ${id}
    RETURNING *;`;
  return rows[0];
}
