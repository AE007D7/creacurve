/**
 * Creative brand mockups — 4 high-quality sharp + SVG composites.
 *
 * No external AI API needed. Each scene is built from SVG layers
 * composited with sharp so the real client logo is always used.
 *
 * Optional: STABILITY_API_KEY → Stability AI generates the scene;
 * the real logo is then composited on top with sharp.
 *
 * Output: 4 items, each 1400×1050 PNG (4:3)
 */

import sharp from "sharp";

const W = 1400;
const H = 1050;

/* ── helpers ─────────────────────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function clamp(v: number, lo = 0, hi = 255) {
  return Math.min(hi, Math.max(lo, v));
}

/** Diagonal gradient RGB pixel buffer */
function gradientBuf(
  w: number, h: number,
  from: [number, number, number],
  to:   [number, number, number],
): Buffer {
  const buf = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 0.5 + (y / h) * 0.5;
      const i = (y * w + x) * 3;
      buf[i]   = clamp(lerp(from[0], to[0], t));
      buf[i+1] = clamp(lerp(from[1], to[1], t));
      buf[i+2] = clamp(lerp(from[2], to[2], t));
    }
  }
  return buf;
}

async function makePng(
  raw: Buffer,
  w: number, h: number, channels: 3 | 4 = 3,
): Promise<Buffer> {
  return sharp(raw, { raw: { width: w, height: h, channels } }).png().toBuffer();
}

/** Resize logo to fit maxW × maxH preserving aspect ratio */
async function fitLogo(logoBuf: Buffer, maxW: number, maxH: number): Promise<Buffer> {
  return sharp(logoBuf).resize(maxW, maxH, { fit: "inside", withoutEnlargement: false }).png().toBuffer();
}

/* ── 1. BUSINESS CARD ────────────────────────────────────────────────────── */

async function buildBusinessCard(logoBuf: Buffer, brandName: string): Promise<Buffer> {
  // Background — soft warm cream gradient
  const bgRaw = gradientBuf(W, H, [250, 248, 244], [232, 228, 220]);
  const bg    = await makePng(bgRaw, W, H);

  const CARD_W = 820;
  const CARD_H = 480;
  const CARD_X = Math.round((W - CARD_W) / 2);
  const CARD_Y = Math.round((H - CARD_H) / 2) - 20;

  // Card shadow — blurred dark ellipse
  const shadowSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <filter id="bl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="32"/>
        </filter>
      </defs>
      <rect x="${CARD_X + 20}" y="${CARD_Y + 40}" width="${CARD_W}" height="${CARD_H}"
            rx="18" fill="rgba(0,0,0,0.22)" filter="url(#bl)"/>
    </svg>`,
  );

  // Card face — white with thin border
  const accent = "#7c3aed";
  const safeLabel = brandName.replace(/[<>&"']/g, "");
  const fontSize  = Math.min(28, Math.max(14, Math.floor(580 / (safeLabel.length || 1))));

  const cardSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
      <!-- card bg -->
      <rect width="${CARD_W}" height="${CARD_H}" rx="16" fill="#ffffff"/>
      <!-- left accent strip -->
      <rect width="7" height="${CARD_H}" rx="4" fill="${accent}"/>
      <!-- bottom brand bar -->
      <rect y="${CARD_H - 54}" width="${CARD_W}" height="54" rx="0" fill="#f8f7ff"/>
      <rect y="${CARD_H - 54}" width="${CARD_W}" height="2" fill="${accent}" opacity="0.2"/>
      <!-- brand name -->
      <text x="${CARD_W / 2}" y="${CARD_H - 18}"
            text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="700"
            fill="#1a1a2e" letter-spacing="2">${safeLabel}</text>
      <!-- card border -->
      <rect width="${CARD_W}" height="${CARD_H}" rx="16" fill="none" stroke="#e8e5ee" stroke-width="1.5"/>
    </svg>`,
  );

  const logo  = await fitLogo(logoBuf, CARD_W - 120, CARD_H - 120);
  const lMeta = await sharp(logo).metadata();
  const lW = lMeta.width!, lH = lMeta.height!;
  const logoX = CARD_X + Math.round((CARD_W - lW) / 2);
  const logoY = CARD_Y + Math.round((CARD_H - 54 - lH) / 2);

  return sharp(bg)
    .composite([
      { input: await sharp(shadowSvg).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(cardSvg).png().toBuffer(),   left: CARD_X, top: CARD_Y },
      { input: logo, left: logoX, top: logoY },
    ])
    .png()
    .toBuffer();
}

/* ── 2. COFFEE CUP ───────────────────────────────────────────────────────── */

async function buildCoffeeCup(logoBuf: Buffer, brandName: string): Promise<Buffer> {
  // Background — warm café dark brown
  const bgRaw = gradientBuf(W, H, [38, 22, 10], [72, 42, 18]);
  const bg    = await makePng(bgRaw, W, H);

  const CUP_W   = 360;
  const CUP_H   = 520;
  const CUP_X   = Math.round((W - CUP_W) / 2);
  const CUP_Y   = Math.round((H - CUP_H) / 2) - 30;

  const safeLabel = brandName.replace(/[<>&"']/g, "");
  const fontSize  = Math.min(22, Math.max(11, Math.floor(280 / (safeLabel.length || 1))));

  // Cup SVG — front-facing cylinder style
  const cupSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CUP_W}" height="${CUP_H}">
      <defs>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#e8e0d6"/>
          <stop offset="40%"  stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#c8bfb2"/>
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#d4c9bb"/>
          <stop offset="100%" stop-color="#b5aa9e"/>
        </linearGradient>
        <filter id="shadow">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <!-- lid -->
      <rect x="10" y="0" width="${CUP_W - 20}" height="52" rx="10" fill="url(#lidGrad)"/>
      <!-- lid rim -->
      <rect x="0" y="42" width="${CUP_W}" height="14" rx="7" fill="#c0b4a6"/>
      <!-- cup body -->
      <path d="M 20,56 L 0,${CUP_H} L ${CUP_W},${CUP_H} L ${CUP_W - 20},56 Z" fill="url(#cupGrad)"/>
      <!-- sleeve band -->
      <rect x="0" y="${Math.round(CUP_H * 0.38)}" width="${CUP_W}" height="${Math.round(CUP_H * 0.28)}"
            fill="#f0ebe3" opacity="0.9"/>
      <line x1="0" y1="${Math.round(CUP_H * 0.38)}" x2="${CUP_W}" y2="${Math.round(CUP_H * 0.38)}"
            stroke="#ccc4b8" stroke-width="1.5"/>
      <line x1="0" y1="${Math.round(CUP_H * 0.66)}" x2="${CUP_W}" y2="${Math.round(CUP_H * 0.66)}"
            stroke="#ccc4b8" stroke-width="1.5"/>
      <!-- brand name on sleeve -->
      <text x="${CUP_W / 2}" y="${Math.round(CUP_H * 0.585)}"
            text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="600" fill="#5a4a3a" letter-spacing="1">
        ${safeLabel}
      </text>
      <!-- bottom ellipse -->
      <ellipse cx="${CUP_W / 2}" cy="${CUP_H}" rx="${CUP_W / 2}" ry="16" fill="#b0a494"/>
    </svg>`,
  );

  // Steam SVG — overlaid above cup
  const steamSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><filter id="bl"><feGaussianBlur stdDeviation="5"/></filter></defs>
      <path d="M ${W/2 - 40},${CUP_Y - 20} Q ${W/2 - 60},${CUP_Y - 60} ${W/2 - 40},${CUP_Y - 100}"
            stroke="rgba(255,255,255,0.25)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#bl)"/>
      <path d="M ${W/2},${CUP_Y - 10} Q ${W/2 + 20},${CUP_Y - 60} ${W/2},${CUP_Y - 110}"
            stroke="rgba(255,255,255,0.25)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#bl)"/>
      <path d="M ${W/2 + 40},${CUP_Y - 20} Q ${W/2 + 60},${CUP_Y - 60} ${W/2 + 40},${CUP_Y - 100}"
            stroke="rgba(255,255,255,0.25)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#bl)"/>
    </svg>`,
  );

  // Logo on sleeve
  const SLEEVE_H  = Math.round(CUP_H * 0.28);
  const logo      = await fitLogo(logoBuf, CUP_W - 60, SLEEVE_H - 36);
  const lMeta     = await sharp(logo).metadata();
  const logoLeft  = CUP_X + Math.round((CUP_W - lMeta.width!) / 2);
  const logoTop   = CUP_Y + Math.round(CUP_H * 0.38) + Math.round((SLEEVE_H - lMeta.height!) / 2) - 22;

  return sharp(bg)
    .composite([
      { input: await sharp(steamSvg).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(cupSvg).png().toBuffer(),   left: CUP_X, top: CUP_Y },
      { input: logo, left: logoLeft, top: logoTop },
    ])
    .png()
    .toBuffer();
}

/* ── 3. T-SHIRT ───────────────────────────────────────────────────────────── */

async function buildTshirt(logoBuf: Buffer, brandName: string): Promise<Buffer> {
  // Background — clean off-white
  const bgRaw = gradientBuf(W, H, [245, 245, 248], [228, 228, 234]);
  const bg    = await makePng(bgRaw, W, H);

  const TS_W = 700;
  const TS_H = 760;
  const TS_X = Math.round((W - TS_W) / 2);
  const TS_Y = Math.round((H - TS_H) / 2) - 20;

  // T-shirt shadow
  const shadowSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><filter id="bl"><feGaussianBlur stdDeviation="28"/></filter></defs>
      <ellipse cx="${W / 2}" cy="${TS_Y + TS_H - 20}" rx="260" ry="40"
               fill="rgba(0,0,0,0.18)" filter="url(#bl)"/>
    </svg>`,
  );

  // T-shirt path — classic crew-neck shape
  const sl  = 90;  // shoulder length
  const nw  = 140; // neck half-width
  const nh  = 60;  // neck depth

  const tshirtSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TS_W}" height="${TS_H}">
      <defs>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#f0eff4"/>
        </linearGradient>
      </defs>
      <path d="
        M ${sl},0
        C ${sl + 20},0 ${TS_W/2 - nw},${nh * 0.3} ${TS_W/2 - nw},${nh}
        Q ${TS_W/2},${nh + 30} ${TS_W/2 + nw},${nh}
        C ${TS_W/2 + nw},${nh * 0.3} ${TS_W - sl - 20},0 ${TS_W - sl},0
        L ${TS_W},${sl + 20}
        C ${TS_W - 30},${sl + 40} ${TS_W - 60},${sl + 60} ${TS_W - 70},${sl + 100}
        L ${TS_W - 80},${TS_H}
        L 80,${TS_H}
        L 70,${sl + 100}
        C 60,${sl + 60} 30,${sl + 40} 0,${sl + 20}
        Z
      " fill="url(#shirtGrad)" stroke="#dddde8" stroke-width="1.5"/>
    </svg>`,
  );

  // Logo on chest
  const logo     = await fitLogo(logoBuf, TS_W - 220, 220);
  const lMeta    = await sharp(logo).metadata();
  const logoLeft = TS_X + Math.round((TS_W - lMeta.width!) / 2);
  const logoTop  = TS_Y + 180;

  // Brand name label below logo
  const safeLabel = brandName.replace(/[<>&"']/g, "");
  const fontSize  = Math.min(18, Math.max(10, Math.floor(500 / (safeLabel.length || 1))));
  const labelSvg  = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TS_W}" height="40">
      <text x="${TS_W / 2}" y="26" text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="500" fill="#9990aa" letter-spacing="3">
        ${safeLabel}
      </text>
    </svg>`,
  );

  const labelPng  = await sharp(labelSvg).png().toBuffer();
  const labelLeft = TS_X;
  const labelTop  = logoTop + lMeta.height! + 14;

  return sharp(bg)
    .composite([
      { input: await sharp(shadowSvg).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(tshirtSvg).png().toBuffer(), left: TS_X, top: TS_Y },
      { input: logo,     left: logoLeft, top: logoTop },
      { input: labelPng, left: labelLeft, top: labelTop },
    ])
    .png()
    .toBuffer();
}

/* ── 4. STOREFRONT SIGN ──────────────────────────────────────────────────── */

async function buildStorefront(logoBuf: Buffer, brandName: string): Promise<Buffer> {
  // Background — deep night gradient
  const bgRaw = gradientBuf(W, H, [8, 10, 22], [18, 24, 52]);
  const bg    = await makePng(bgRaw, W, H);

  const BOX_W = 820;
  const BOX_H = 340;
  const BOX_X = Math.round((W - BOX_W) / 2);
  const BOX_Y = Math.round(H * 0.28);

  const safeLabel = brandName.replace(/[<>&"']/g, "");
  const fontSize  = Math.min(32, Math.max(14, Math.floor(680 / (safeLabel.length || 1))));

  // Glow bloom behind box
  const glowSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="60" result="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#a78bfa" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="${W / 2}" cy="${BOX_Y + BOX_H / 2}" rx="${BOX_W * 0.7}" ry="${BOX_H * 1.1}"
               fill="url(#rg)" filter="url(#glow)"/>
    </svg>`,
  );

  // Sign box — dark frame with inner illuminated panel
  const signSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BOX_W}" height="${BOX_H}">
      <defs>
        <linearGradient id="innerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#1e1540"/>
          <stop offset="100%" stop-color="#16103a"/>
        </linearGradient>
        <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#4a3f7a"/>
          <stop offset="100%" stop-color="#2d2552"/>
        </linearGradient>
        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <!-- outer frame -->
      <rect width="${BOX_W}" height="${BOX_H}" rx="20" fill="url(#frameGrad)"/>
      <!-- inner panel -->
      <rect x="14" y="14" width="${BOX_W - 28}" height="${BOX_H - 28}" rx="12" fill="url(#innerGrad)"/>
      <!-- corner accents -->
      <rect x="0" y="0"             width="40" height="4"  rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="0" y="0"             width="4"  height="40" rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="${BOX_W - 40}" y="0" width="40" height="4"  rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="${BOX_W - 4}"  y="0" width="4"  height="40" rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="0" y="${BOX_H - 4}"             width="40" height="4" rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="0" y="${BOX_H - 40}"            width="4"  height="40" rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="${BOX_W - 40}" y="${BOX_H - 4}" width="40" height="4" rx="2" fill="#7c3aed" opacity="0.8"/>
      <rect x="${BOX_W - 4}"  y="${BOX_H - 40}" width="4" height="40" rx="2" fill="#7c3aed" opacity="0.8"/>
      <!-- brand name -->
      <text x="${BOX_W / 2}" y="${BOX_H - 28}"
            text-anchor="middle"
            font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="300" fill="#a78bfa" letter-spacing="6" opacity="0.9">
        ${safeLabel}
      </text>
    </svg>`,
  );

  // Street/ground reflection
  const reflSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="reflGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
        </linearGradient>
        <filter id="bl2"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect x="${BOX_X}" y="${BOX_Y + BOX_H}" width="${BOX_W}" height="120"
            fill="url(#reflGrad)" filter="url(#bl2)"/>
    </svg>`,
  );

  // Logo inside sign
  const logo     = await fitLogo(logoBuf, BOX_W - 120, BOX_H - 110);
  const lMeta    = await sharp(logo).metadata();
  // tint logo white/light for dark sign background
  const logoLight = await sharp(logo)
    .modulate({ brightness: 1.8, saturation: 0.4 })
    .png()
    .toBuffer();
  const logoLeft = BOX_X + Math.round((BOX_W - lMeta.width!) / 2);
  const logoTop  = BOX_Y + Math.round((BOX_H - 50 - lMeta.height!) / 2);

  return sharp(bg)
    .composite([
      { input: await sharp(glowSvg).png().toBuffer(),  left: 0, top: 0 },
      { input: await sharp(reflSvg).png().toBuffer(),  left: 0, top: 0 },
      { input: await sharp(signSvg).png().toBuffer(),  left: BOX_X, top: BOX_Y },
      { input: logoLight, left: logoLeft, top: logoTop },
    ])
    .png()
    .toBuffer();
}

/* ── Stability AI path ───────────────────────────────────────────────────── */

async function buildStabilityImage(prompt: string, apiKey: string): Promise<Buffer | null> {
  try {
    const form = new FormData();
    form.append("prompt",        prompt);
    form.append("aspect_ratio",  "4:3");
    form.append("output_format", "png");
    const res = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" }, body: form },
    );
    if (!res.ok) { console.error("Stability error:", await res.text()); return null; }
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.error("Stability AI failed:", e);
    return null;
  }
}

const STABILITY_PROMPTS: Record<string, (brand: string) => string> = {
  "mockup-business-card.png": (b) =>
    `Luxury business card flat lay on white marble, brand logo '${b}', minimalist gold accents, studio lighting, photorealistic 4K`,
  "mockup-coffee-cup.png": (b) =>
    `Premium kraft coffee cup with '${b}' logo, cozy cafe bokeh background, warm lighting, photorealistic 4K`,
  "mockup-tshirt.png": (b) =>
    `White t-shirt flat lay, '${b}' logo on chest, clean gray background, natural lighting, product photography 4K`,
  "mockup-storefront.png": (b) =>
    `Modern storefront illuminated LED sign '${b}', sleek glass entrance, golden hour, photorealistic`,
};

/* ── Public entry point ──────────────────────────────────────────────────── */

export async function buildCreativeMockups(opts: {
  logoBuf:   Buffer;
  brandName: string;
  tagline:   string;
  accentHex: string;
}): Promise<{ name: string; buf: Buffer }[]> {
  const { logoBuf, brandName } = opts;
  const stabilityKey = process.env.STABILITY_API_KEY;

  const builders: [string, () => Promise<Buffer>][] = [
    ["mockup-business-card.png", () => buildBusinessCard(logoBuf, brandName)],
    ["mockup-coffee-cup.png",    () => buildCoffeeCup(logoBuf, brandName)],
    ["mockup-tshirt.png",        () => buildTshirt(logoBuf, brandName)],
    ["mockup-storefront.png",    () => buildStorefront(logoBuf, brandName)],
  ];

  const results = await Promise.all(
    builders.map(async ([name, buildFn]) => {
      try {
        // If Stability AI key is set, try AI-generated scene first
        if (stabilityKey) {
          const prompt = STABILITY_PROMPTS[name]?.(brandName);
          if (prompt) {
            const aiBuf = await buildStabilityImage(prompt, stabilityKey);
            if (aiBuf) return { name, buf: aiBuf };
          }
        }
        // Always-on sharp/SVG composite — uses the real client logo
        const buf = await buildFn();
        return { name, buf };
      } catch (e) {
        console.error(`Mockup failed for ${name}:`, e);
        return null;
      }
    }),
  );

  return results.filter((r): r is { name: string; buf: Buffer } => r !== null);
}
