# CreaCurve Setup Guide

## 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

### Supabase Setup
1. Create project at supabase.com
2. Go to SQL Editor → paste contents of `lib/supabase/schema.sql` → Run
3. Create storage buckets: `logos` (public), `assets` (public), `zips` (private)
4. Copy: Project URL, anon key, service role key

### Stripe Setup
1. Create product at stripe.com/dashboard
2. Get publishable key, secret key
3. Webhook: add endpoint `https://creacurve.com/api/stripe/webhook`
4. Listen for: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy webhook signing secret

### Anthropic
1. Get API key from console.anthropic.com

### Browserless
1. Sign up at browserless.io
2. Get API key from dashboard

### Resend
1. Sign up at resend.com
2. Add domain `creacurve.com` → configure DNS
3. Get API key

### Upstash Redis
1. Create database at upstash.com
2. Copy REST URL and token

## 2. Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 3. Deployment (Vercel)

```bash
npx vercel --prod
```

Add all environment variables in Vercel dashboard under Settings → Environment Variables.

Set `NEXT_PUBLIC_SITE_URL=https://creacurve.com` in production.

## 4. Post-Deploy

1. Update Stripe webhook URL to your production domain
2. Verify Resend domain DNS is propagated
3. Test full flow: upload → pay → process → receive

## 5. Architecture Notes

- The processing pipeline runs in `/api/generate` which is called by the Stripe webhook
- Supabase realtime broadcasts progress updates to the `/processing/[id]` page
- ZIP files get 7-day signed URLs stored in the `zips` bucket
- Concurrency limit of 6 parallel Claude calls is set in `/lib/orchestrator.ts`
