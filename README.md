# AI Nexus GPT (Nexus GPT) – Functional MVP (Option A)

Working flow:

**Login → Agree to policies → NIC last-4 (Option A) → Choose pool (10 slots) → Book Zoom → Admin marks call completed → 24h trial → 24h grace + payment link → pause + slot release**

## Local run
1) `npm install`
2) Copy `.env.example` → `.env` and fill values
3) `npx prisma generate`
4) `npx prisma migrate dev --name init`
5) `npm run seed`
6) `npm run dev`

## Admin pages
Admin is whoever matches `ADMIN_EMAIL`.

- `/admin` settings
- `/admin/pools` manage pools
- `/admin/bookings` mark completed (starts trial)
- `/admin/payments` paste PayHere link + send email (starts grace)

## Cron
Hit this endpoint hourly:
- `GET /api/cron/subscription-tick`

On Vercel you’ll set a Cron Job to call:
`https://YOUR_DOMAIN/api/cron/subscription-tick`

## Domain
Add `ai-nexus-gpt.com` in Vercel and follow their DNS instructions at your registrar.
