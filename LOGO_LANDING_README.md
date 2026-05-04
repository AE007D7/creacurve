# Logo Design Landing Page

Live at: `http://localhost:3000/logo-design`

## File tree

```
app/
  logo-design/
    layout.tsx          — Light theme isolation (overrides dark global styles)
    page.tsx            — Route entry point, JSON-LD Service schema

app/api/
  leads/
    route.ts            — POST /api/leads — validates with Zod, logs, optional Resend email

components/
  logo-design/
    Nav.tsx             — Sticky top nav with scroll-aware border, mobile hamburger
    Hero.tsx            — 2-col headline + image grid + trust strip
    Pricing.tsx         — 3 pricing tiers (Starter $35, Professional $119, Platinum $299)
    Portfolio.tsx       — Filterable grid, 4-col, Load more
    Features.tsx        — 6 feature cards with Lucide icons
    Industries.tsx      — 28 industry pills
    Testimonials.tsx    — 6 review cards with star ratings
    FAQSection.tsx      — Radix accordion, two-column layout
    LeadForm.tsx        — Full lead capture form → POST /api/leads
    CTAStrip.tsx        — Final CTA section
    ChatWidget.tsx      — Fixed chat bubble, localStorage persistence
```

## Customising copy & pricing

All copy is defined inline in each component. To update pricing:

- Open `components/logo-design/Pricing.tsx`
- Edit the `TIERS` array near the top — each tier has `name`, `price`, `was`, `features[]`, and `popular`

To update FAQ answers, edit the `FAQS` array in `components/logo-design/FAQSection.tsx`.

To update testimonials, edit the `TESTIMONIALS` array in `components/logo-design/Testimonials.tsx`.

## Swapping placeholder portfolio images

The portfolio currently uses `https://picsum.photos/seed/{n}/400/400` URLs.

To use real images:
1. Place your logo images in `public/logo-design/portfolio/` (e.g. `logo-01.jpg`, `logo-02.jpg`)
2. Open `components/logo-design/Portfolio.tsx`
3. Replace the `ITEMS` array entries' `src` field with `/logo-design/portfolio/logo-01.jpg` etc.
4. Each item also has a `category` field for tab filtering — set it to one of: `3D`, `Abstract`, `Mascot`, `Wordmark`, `Emblem`, `Monogram`, `Letterform`

## How leads are stored / forwarded

**Right now:** Leads are logged to the server console via `console.log`.

**Optional email notification:** If `RESEND_API_KEY` is set in `.env.local`, every submission triggers a formatted HTML email to `ayoubelkihel7@gmail.com` with all lead fields.

**To persist to Supabase:** In `app/api/leads/route.ts`, add a Supabase insert after the `console.log`:

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = createClient();
await supabase.from("leads").insert({ ...lead, created_at: new Date().toISOString() });
```

You'll also need a `leads` table in your Supabase schema.

## Chat widget

The chat widget (`components/logo-design/ChatWidget.tsx`) is imported directly in `app/logo-design/page.tsx`. To make it available site-wide, move the `<ChatWidget />` import into `app/layout.tsx`.

The widget posts to `/api/leads` with `source: "chat"` so chat submissions are distinguishable in logs/email.
