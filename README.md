
# Shorting Webapp (Next.js + Vercel Postgres)

Paper trading short recommendations blending technical indicators with a tiny online logistic regression model.

## One‑click Deploy (Vercel)

1. Create a new Vercel project from this repo (or upload the provided ZIP).
2. Add **Environment Variables** in Vercel → Project → Settings:
   - `ALPHA_VANTAGE_KEY`
   - The Postgres vars created by **Vercel Postgres** integration:
     - `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`
3. Deploy. After first deploy, call `/api/init` once to create tables.

## Local Dev

```bash
npm i
cp .env.example .env.local   # fill values
npm run dev
# (optional) initialize db locally if connected:
npm run init:db
```

## Endpoints

- `POST /api/scan` → `{ universe?: string[] }` returns one recommendation
- `POST /api/train` → `{ features: Record<string,number>, label: 0|1 }` online SGD update
- `GET /api/trades` → list trades
- `POST /api/trades` → create trade `{ symbol, side, qty, entryPrice?, meta? }`
- `PATCH /api/trades/:id` → update `{ status?, exitPrice? }`
- `GET /api/init` → create tables

## Notes

- Indicators included: RSI(14), MACD(12,26,9), ATR(14), Bollinger Bands(20,2) with z-score, SMA(20), simple slope(5).
- Position sizing: naive 1% equity risk with 1×ATR stop.
- Model: logistic regression with SGD; parameters stored in `models` table as JSON.
- This is **not** financial advice. For research/paper‑trading only.
