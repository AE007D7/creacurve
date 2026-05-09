/**
 * 3D logo mockup on a frosted glass office wall.
 *
 * AI path  → Stability AI (STABILITY_API_KEY) or DALL-E 3 (OPENAI_API_KEY)
 * Fallback → pure Sharp compositing (no external API needed)
 *
 * Output: ~1400×1050 PNG (≈ 4:3)
 */

import sharp from "sharp";

const W = 1400;
const H = 1050;

/* ── colour helpers ─────────────────────────────────────────────────────────*/

function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t); }

/** Horizontal gradient RGBA buffer */
function hGrad(
  w: number, h: number,
  left:  [number, number, number, number],
  right: [number, number, number, number],
): Buffer {
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = x / (w - 1);
      const i = (y * w + x) * 4;
      buf[i]   = lerp(left[0], right[0], t);
      buf[i+1] = lerp(left[1], right[1], t);
      buf[i+2] = lerp(left[2], right[2], t);
      buf[i+3] = lerp(left[3], right[3], t);
    }
  }
  return buf;
}

/** Diagonal gradient RGB buffer for background */
async function bgGradient(): Promise<Buffer> {
  // Deep navy (#080d1f) → charcoal navy (#12193a) → dark slate (#0e1520)
  const buf = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t  = (x / W) * 0.55 + (y / H) * 0.45;
      const i  = (y * W + x) * 3;
      // from (#080d1f) to (#1e2b5e) diagonally
      buf[i]   = lerp(8,  30, t);
      buf[i+1] = lerp(13, 43, t);
      buf[i+2] = lerp(31, 94, t);
    }
  }
  return buf;
}

/** Solid RGBA buffer */
function solid(w: number, h: number, r: number, g: number, b: number, a: number): Buffer {
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < buf.length; i += 4) {
    buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = a;
  }
  return buf;
}

/* ── gold recolor ────────────────────────────────────────────────────────── */

/**
 * Recolors a PNG (any content) to a metallic gold horizontal gradient,
 * preserving the original alpha channel.
 * Left = dark bronze, center = rich gold, right = bright gold highlight.
 */
async function recolorGold(src: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const out = Buffer.alloc(data.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a === 0) { out[i+3] = 0; continue; }

      // Horizontal: 0 = dark bronze, 1 = bright gold
      const t  = x / (w - 1);
      // Vertical highlight: brightest at ~30% from top
      const vy = y / (h - 1);
      const hl = Math.max(0, 1 - Math.abs(vy - 0.28) * 5) * 0.25; // 0–0.25 boost

      // Base gold ramp: bronze #8B6914 → rich gold #D4AF37 → bright #F5E076
      const r0 = t < 0.5 ? lerp(139, 212, t * 2)       : lerp(212, 245, (t - 0.5) * 2);
      const g0 = t < 0.5 ? lerp(105, 175, t * 2)       : lerp(175, 224, (t - 0.5) * 2);
      const b0 = t < 0.5 ? lerp(20,  55,  t * 2)       : lerp(55,  116, (t - 0.5) * 2);

      out[i]   = Math.min(255, Math.round(r0 + (255 - r0) * hl));
      out[i+1] = Math.min(255, Math.round(g0 + (255 - g0) * hl));
      out[i+2] = Math.min(255, Math.round(b0 + (255 - b0) * hl));
      out[i+3] = a;
    }
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

/* ── extrusion shadow ────────────────────────────────────────────────────── */

/** Stack offset copies of the gold logo to simulate 3D extrusion depth */
async function buildExtrusion(goldLogo: Buffer, steps = 6): Promise<Buffer[]> {
  const layers: Buffer[] = [];
  const { data, info } = await sharp(goldLogo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  for (let s = steps; s >= 1; s--) {
    const fade  = s / steps;          // 1 at deepest, low at surface
    const dark  = 0.2 + 0.3 * fade;  // darker for deeper layers

    const layer = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i += 4) {
      layer[i]   = Math.round(139 * dark);
      layer[i+1] = Math.round(95  * dark);
      layer[i+2] = Math.round(10  * dark);
      layer[i+3] = Math.round(data[i+3] * 0.9);
    }

    layers.push(
      await sharp(layer, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer()
    );
  }
  return layers;
}

/* ── glow bloom ─────────────────────────────────────────────────────────── */

async function buildGlow(goldLogo: Buffer): Promise<Buffer> {
  // Blur the gold logo heavily → warm amber glow
  const { data, info } = await sharp(goldLogo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const glow = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    glow[i]   = 255;
    glow[i+1] = 200;
    glow[i+2] = 80;
    glow[i+3] = Math.round(data[i+3] * 0.6);
  }

  return sharp(glow, { raw: { width: w, height: h, channels: 4 } })
    .blur(22)
    .png()
    .toBuffer();
}

/* ── SVG text helpers ────────────────────────────────────────────────────── */

async function svgTagline(text: string, maxW: number): Promise<Buffer> {
  // Measure approximate text width; clamp font size
  const fontSize = Math.min(26, Math.floor(maxW / (text.length * 0.55 + 1)));
  const svgW = maxW;
  const svgH = 60;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">
    <text x="${svgW / 2}" y="38" text-anchor="middle"
          font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
          font-size="${fontSize}" font-weight="300"
          fill="#b0b8d0" letter-spacing="5">${text.toUpperCase()}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function svgBrandName(text: string, maxW: number): Promise<Buffer> {
  const fontSize = Math.min(72, Math.floor(maxW / (text.length * 0.62 + 1)));
  const svgW = maxW;
  const svgH = 110;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#8B6914"/>
        <stop offset="45%"  stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#F5E076"/>
      </linearGradient>
    </defs>
    <text x="${svgW / 2}" y="82" text-anchor="middle"
          font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
          font-size="${fontSize}" font-weight="700"
          fill="url(#gold)" letter-spacing="3">${text}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/* ── frosted glass panel ─────────────────────────────────────────────────── */

async function buildGlassPanel(w: number, h: number): Promise<Buffer> {
  // White-blue semi-transparent rectangle
  const glassBuf = solid(w, h, 220, 228, 248, 38);
  const base = await sharp(glassBuf, { raw: { width: w, height: h, channels: 4 } })
    .blur(3)
    .png()
    .toBuffer();

  // Thin bright top-edge highlight
  const highlight = solid(w, 2, 255, 255, 255, 80);
  const hlBuf = await sharp(highlight, { raw: { width: w, height: 2, channels: 4 } }).png().toBuffer();

  return sharp(base)
    .composite([{ input: hlBuf, left: 0, top: 0 }])
    .png()
    .toBuffer();
}

/* ── ambient light circles (fake bokeh) ─────────────────────────────────── */

async function buildBokeh(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <radialGradient id="c1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <ellipse cx="200"  cy="180"  rx="320" ry="320" fill="url(#c1)"/>
    <ellipse cx="1200" cy="900"  rx="280" ry="280" fill="url(#c2)"/>
    <ellipse cx="700"  cy="100"  rx="180" ry="180" fill="url(#c3)"/>
    <ellipse cx="1300" cy="200"  rx="200" ry="200" fill="url(#c2)"/>
    <ellipse cx="100"  cy="900"  rx="240" ry="240" fill="url(#c1)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/* ── vignette ────────────────────────────────────────────────────────────── */

async function buildVignette(): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <radialGradient id="v" cx="50%" cy="50%" r="70%">
      <stop offset="0%"   stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <rect width="${W}" height="${H}" fill="url(#v)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/* ── main sharp fallback ─────────────────────────────────────────────────── */

async function buildSharpMockup(
  logoBuf: Buffer | null,
  brandName: string,
  tagline: string,
): Promise<Buffer> {
  // 1 — Background
  const bgRaw   = await bgGradient();
  const bgBuf   = await sharp(bgRaw, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();

  // 2 — Bokeh
  const bokeh   = await buildBokeh();

  // 3 — Frosted glass panel
  const PW = 900, PH = 520;
  const glassPanel = await buildGlassPanel(PW, PH);
  const glassX = Math.round((W - PW) / 2);
  const glassY = Math.round((H - PH) / 2) - 40;

  // 4 — Build logo layer(s)
  const logoMaxW = PW - 120;
  const logoMaxH = PH - 180;

  let composites: sharp.OverlayOptions[] = [];

  if (logoBuf) {
    // Resize logo to fit the panel
    const resized   = await sharp(logoBuf).resize(logoMaxW, logoMaxH, { fit: "inside" }).png().toBuffer();
    const lMeta     = await sharp(resized).metadata();
    const lW = lMeta.width!, lH = lMeta.height!;

    const goldLogo  = await recolorGold(resized);
    const glow      = await buildGlow(goldLogo);
    const extrusion = await buildExtrusion(goldLogo);

    const logoX = glassX + Math.round((PW - lW) / 2);
    const logoY = glassY + Math.round((PH - lH) / 2) - 30;

    // Glow behind everything
    composites.push({ input: glow, left: logoX - 14, top: logoY - 14 });

    // Extrusion layers
    extrusion.forEach((layer, i) => {
      composites.push({ input: layer, left: logoX + i + 1, top: logoY + Math.round((i + 1) * 0.6) });
    });

    // Main gold logo
    composites.push({ input: goldLogo, left: logoX, top: logoY });

    // Tagline below
    const tlW = Math.min(logoMaxW, 600);
    const taglineBuf = await svgTagline(tagline || brandName, tlW);
    const tlMeta = await sharp(taglineBuf).metadata();
    composites.push({
      input: taglineBuf,
      left: glassX + Math.round((PW - tlMeta.width!) / 2),
      top:  logoY + lH + 18,
    });
  } else {
    // No logo image — render brand name as SVG gold text + tagline
    const nameBuf  = await svgBrandName(brandName, PW - 80);
    const nameMeta = await sharp(nameBuf).metadata();
    const nameX    = glassX + Math.round((PW - nameMeta.width!)  / 2);
    const nameY    = glassY + Math.round((PH - nameMeta.height!) / 2) - 30;

    composites.push({ input: nameBuf, left: nameX, top: nameY });

    const tlW = Math.min(PW - 80, 600);
    const taglineBuf = await svgTagline(tagline || "Where brands come alive", tlW);
    const tlMeta = await sharp(taglineBuf).metadata();
    composites.push({
      input: taglineBuf,
      left: glassX + Math.round((PW - tlMeta.width!) / 2),
      top:  nameY + nameMeta.height! + 12,
    });
  }

  // 5 — Vignette
  const vignette = await buildVignette();

  // 6 — Compose all layers
  return sharp(bgBuf)
    .composite([
      { input: bokeh,      left: 0,      top: 0      },
      { input: glassPanel, left: glassX, top: glassY },
      ...composites,
      { input: vignette,   left: 0,      top: 0      },
    ])
    .png()
    .toBuffer();
}

/* ── AI path — Stability AI ─────────────────────────────────────────────── */

async function buildStabilityMockup(
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  try {
    const form = new FormData();
    form.append("prompt",       prompt);
    form.append("aspect_ratio", "4:3");
    form.append("output_format","png");

    const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method:  "POST",
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" },
      body:    form,
    });

    if (!res.ok) { console.error("Stability error:", await res.text()); return null; }
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.error("Stability AI failed:", e);
    return null;
  }
}

/* ── AI path — DALL-E 3 ─────────────────────────────────────────────────── */

async function buildDalleMockup(
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model:   "dall-e-3",
        prompt,
        n:       1,
        size:    "1792x1024",
        quality: "hd",
      }),
    });

    if (!res.ok) { console.error("DALL-E error:", await res.text()); return null; }
    const json    = await res.json() as { data: { url: string }[] };
    const imgRes  = await fetch(json.data[0].url);
    return Buffer.from(await imgRes.arrayBuffer());
  } catch (e) {
    console.error("DALL-E failed:", e);
    return null;
  }
}

/* ── public entry point ─────────────────────────────────────────────────── */

export async function buildWallMockup(opts: {
  logoBuf:   Buffer | null;
  brandName: string;
  tagline:   string;
}): Promise<Buffer> {
  const { logoBuf, brandName, tagline } = opts;

  const fullPrompt = `A professional 3D logo mockup displayed on a frosted glass office wall. The logo "${brandName}" is rendered in polished metallic gold/bronze with a subtle gradient (lighter on the right, darker on the left), featuring a glossy 3D extrusion effect with soft drop shadows. Below the main logo, the tagline "${tagline || "Where brands come alive"}" appears in thin, light gray sans-serif font. Background: A blurred modern corporate office interior visible through frosted glass — showing soft silhouettes of meeting room furniture, ceiling lights, and glass partitions. Deep navy-blue to charcoal gradient ambiance with cool blue tones. Lighting: Cinematic soft lighting from above-left, creating realistic reflections on the metallic letters and a subtle glow on the glass surface. Style: Photorealistic, premium corporate branding presentation, high resolution, sharp logo focus with bokeh background blur. Mood: Elegant, professional, luxurious, modern tech/startup vibe.`;

  // Try Stability AI first
  const stabilityKey = process.env.STABILITY_API_KEY;
  if (stabilityKey) {
    const img = await buildStabilityMockup(fullPrompt, stabilityKey);
    if (img) return img;
  }

  // Try DALL-E 3
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const img = await buildDalleMockup(fullPrompt, openaiKey);
    if (img) return img;
  }

  // Sharp fallback — always works
  return buildSharpMockup(logoBuf, brandName, tagline);
}
