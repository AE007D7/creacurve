/**
 * Creative brand mockups — 4 real-world placement scenes.
 *
 * AI path  → Stability AI (STABILITY_API_KEY) — prompts with brand name, image returned as-is
 *           → DALL-E 3 (OPENAI_API_KEY)       — generates EMPTY background scene, then
 *                                                composites the real logo on top with sharp
 * Fallback → pure Sharp compositing (no external API needed)
 *
 * Output: up to 4 items, each ~1400×1050 PNG (≈ 4:3)
 */

import sharp from "sharp";

const W = 1400;
const H = 1050;

/* ── mockup definitions ─────────────────────────────────────────────────────*/

interface LogoPlacement {
  /** Horizontal centre as fraction of W */
  xFrac: number;
  /** Vertical centre as fraction of H */
  yFrac: number;
  /** Max width the logo should be resized to */
  maxW: number;
}

interface MockupDef {
  name: string;
  /** Stability AI prompt — may reference brand name */
  stabilityPrompt: (brandName: string, tagline: string) => string;
  /** DALL-E 3 prompt — empty scene, NO logo, NO text */
  dallePrompt: string;
  /** Diagonal-gradient from/to colors [R,G,B] for sharp fallback */
  bgFrom: [number, number, number];
  bgTo:   [number, number, number];
  /** Product surface rectangle dimensions (sharp fallback) */
  surface: { w: number; h: number };
  /** Where to composite the real logo onto a DALL-E scene */
  logoPlacement: LogoPlacement;
}

const MOCKUPS: MockupDef[] = [
  {
    name: "mockup-business-card.png",
    stabilityPrompt: (brandName) =>
      `Professional luxury business card mockup, top-down flat lay on white marble surface, the card features the brand logo '${brandName}' in elegant typography, minimalist design with subtle gold accents, soft studio lighting, photorealistic product photography, 4K resolution`,
    dallePrompt:
      "Top-down flat lay photo of a blank white business card on white marble surface, soft shadows, studio lighting, photorealistic, 4K, no text, no logo, no print",
    bgFrom:  [248, 248, 246],
    bgTo:    [235, 232, 228],
    surface: { w: 700, h: 420 },
    logoPlacement: { xFrac: 0.5, yFrac: 0.5, maxW: 280 },
  },
  {
    name: "mockup-coffee-cup.png",
    stabilityPrompt: (brandName) =>
      `Premium takeaway coffee cup mockup with '${brandName}' logo printed on white kraft cup, cozy modern cafe background bokeh, warm lighting, photorealistic product shot, 4K`,
    dallePrompt:
      "Premium white kraft takeaway coffee cup, cozy modern cafe background with bokeh, warm lighting, photorealistic product shot, 4K, no logo no text no print",
    bgFrom:  [62,  38,  20],
    bgTo:    [120, 72,  30],
    surface: { w: 400, h: 600 },
    logoPlacement: { xFrac: 0.5, yFrac: 0.38, maxW: 130 },
  },
  {
    name: "mockup-tshirt.png",
    stabilityPrompt: (brandName) =>
      `Premium white t-shirt flat lay mockup on clean light gray background, '${brandName}' logo printed on chest area, minimalist lifestyle product photography, soft natural lighting, high resolution`,
    dallePrompt:
      "White t-shirt flat lay on clean light gray background, soft natural lighting, high resolution product photography, no print no logo no text",
    bgFrom:  [240, 240, 240],
    bgTo:    [220, 220, 220],
    surface: { w: 600, h: 700 },
    logoPlacement: { xFrac: 0.5, yFrac: 0.40, maxW: 200 },
  },
  {
    name: "mockup-storefront.png",
    stabilityPrompt: (brandName) =>
      `Modern retail storefront sign mockup, '${brandName}' logo on illuminated LED signage above a sleek glass entrance, urban street photography, golden hour lighting, photorealistic, high resolution`,
    dallePrompt:
      "Modern retail glass storefront entrance at night, illuminated from inside, urban street, golden hour, photorealistic, no signage no text no logo",
    bgFrom:  [8,  12,  28],
    bgTo:    [20, 30,  60],
    surface: { w: 800, h: 500 },
    logoPlacement: { xFrac: 0.5, yFrac: 0.35, maxW: 280 },
  },
];

/* ── colour helpers ─────────────────────────────────────────────────────────*/

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Diagonal gradient RGB buffer */
function diagonalBg(
  w: number,
  h: number,
  from: [number, number, number],
  to:   [number, number, number],
): Buffer {
  const buf = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 0.55 + (y / h) * 0.45;
      const i = (y * w + x) * 3;
      buf[i]   = lerp(from[0], to[0], t);
      buf[i+1] = lerp(from[1], to[1], t);
      buf[i+2] = lerp(from[2], to[2], t);
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

/* ── SVG label helper ────────────────────────────────────────────────────── */

function svgBrandLabel(text: string, maxW: number, dark: boolean): Buffer {
  const fontSize = Math.min(48, Math.floor(maxW / (text.length * 0.62 + 1)));
  const fill     = dark ? "#ffffff" : "#1a1a1a";
  const svgW     = maxW;
  const svgH     = 80;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">
    <text x="${svgW / 2}" y="54" text-anchor="middle"
          font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
          font-size="${fontSize}" font-weight="700"
          fill="${fill}" letter-spacing="3">${text}</text>
  </svg>`;
  return Buffer.from(svg);
}

/* ── sharp fallback ──────────────────────────────────────────────────────── */

async function buildSharpFallback(
  def:       MockupDef,
  logoBuf:   Buffer,
  brandName: string,
): Promise<Buffer> {
  const { bgFrom, bgTo, surface } = def;

  // 1 — Background
  const bgRaw = diagonalBg(W, H, bgFrom, bgTo);
  const bgBuf = await sharp(bgRaw, { raw: { width: W, height: H, channels: 3 } })
    .png()
    .toBuffer();

  // 2 — White product surface (centered)
  const surfX = Math.round((W - surface.w) / 2);
  const surfY = Math.round((H - surface.h) / 2);

  const surfRaw = solid(surface.w, surface.h, 255, 255, 255, 230);
  const surfBuf = await sharp(surfRaw, {
    raw: { width: surface.w, height: surface.h, channels: 4 },
  })
    .png()
    .toBuffer();

  // 3 — Logo resized to fit inside the surface with padding
  const logoMaxW = surface.w - 80;
  const logoMaxH = surface.h - 120;
  const resized  = await sharp(logoBuf)
    .resize(logoMaxW, logoMaxH, { fit: "inside" })
    .png()
    .toBuffer();
  const lMeta = await sharp(resized).metadata();
  const lW    = lMeta.width!;
  const lH    = lMeta.height!;

  // Centre the logo within the surface
  const logoX = surfX + Math.round((surface.w - lW) / 2);
  const logoY = surfY + Math.round((surface.h - lH) / 2) - 20;

  // 4 — Brand name label below the surface
  const isDark   = bgFrom[0] < 100; // dark backgrounds
  const labelSvg = svgBrandLabel(brandName, Math.min(surface.w, 700), isDark);
  const labelBuf = await sharp(labelSvg).png().toBuffer();
  const lbMeta   = await sharp(labelBuf).metadata();
  const labelX   = Math.round((W - lbMeta.width!) / 2);
  const labelY   = surfY + surface.h + 20;

  // 5 — Compose
  return sharp(bgBuf)
    .composite([
      { input: surfBuf,  left: surfX,  top: surfY  },
      { input: resized,  left: logoX,  top: logoY  },
      { input: labelBuf, left: labelX, top: labelY },
    ])
    .png()
    .toBuffer();
}

/* ── logo-onto-scene compositor ──────────────────────────────────────────── */

/**
 * Resize AI-generated scene to W×H, then composite the real logo on top
 * at the position defined by MockupDef.logoPlacement.
 */
async function compositeLogoOntoScene(
  scene:   Buffer,
  logoBuf: Buffer,
  def:     MockupDef,
): Promise<Buffer> {
  const { xFrac, yFrac, maxW } = def.logoPlacement;

  // 1 — Resize scene to canonical dimensions
  const sceneBuf = await sharp(scene)
    .resize(W, H, { fit: "cover" })
    .png()
    .toBuffer();

  // 2 — Resize logo to fit within maxW × maxW (preserve aspect ratio)
  const resizedLogo = await sharp(logoBuf)
    .resize(maxW, maxW, { fit: "inside" })
    .png()
    .toBuffer();

  const lMeta = await sharp(resizedLogo).metadata();
  const lW = lMeta.width!;
  const lH = lMeta.height!;

  // 3 — Compute placement (centred on xFrac, yFrac)
  const left = Math.round(W * xFrac - lW / 2);
  const top  = Math.round(H * yFrac - lH / 2);

  // 4 — Composite and return
  return sharp(sceneBuf)
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

/* ── AI path — Stability AI ─────────────────────────────────────────────── */

async function buildStabilityImage(
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  try {
    const form = new FormData();
    form.append("prompt",        prompt);
    form.append("aspect_ratio",  "4:3");
    form.append("output_format", "png");

    const res = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method:  "POST",
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" },
        body:    form,
      },
    );

    if (!res.ok) { console.error("Stability error:", await res.text()); return null; }
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.error("Stability AI failed:", e);
    return null;
  }
}

/* ── AI path — DALL-E 3 ─────────────────────────────────────────────────── */

async function buildDalleImage(
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method:  "POST",
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
    const json   = await res.json() as { data: { url: string }[] };
    const imgRes = await fetch(json.data[0].url);
    return Buffer.from(await imgRes.arrayBuffer());
  } catch (e) {
    console.error("DALL-E failed:", e);
    return null;
  }
}

/* ── per-mockup builder ─────────────────────────────────────────────────── */

async function buildOneMockup(
  def:          MockupDef,
  logoBuf:      Buffer,
  brandName:    string,
  tagline:      string,
  stabilityKey: string | undefined,
  openaiKey:    string | undefined,
): Promise<{ name: string; buf: Buffer } | null> {

  // Try Stability AI — returns full scene with brand name baked in
  if (stabilityKey) {
    const img = await buildStabilityImage(def.stabilityPrompt(brandName, tagline), stabilityKey);
    if (img) return { name: def.name, buf: img };
  }

  // Try DALL-E 3 — generates empty background scene, then we composite the real logo
  if (openaiKey) {
    const scene = await buildDalleImage(def.dallePrompt, openaiKey);
    if (scene) {
      try {
        const buf = await compositeLogoOntoScene(scene, logoBuf, def);
        return { name: def.name, buf };
      } catch (e) {
        console.error(`Logo composite failed for ${def.name}:`, e);
        // fall through to sharp fallback
      }
    }
  }

  // Sharp fallback — always works
  try {
    const buf = await buildSharpFallback(def, logoBuf, brandName);
    return { name: def.name, buf };
  } catch (e) {
    console.error(`Sharp fallback failed for ${def.name}:`, e);
    return null;
  }
}

/* ── public entry point ─────────────────────────────────────────────────── */

export async function buildCreativeMockups(opts: {
  logoBuf:   Buffer;
  brandName: string;
  tagline:   string;
  accentHex: string;
}): Promise<{ name: string; buf: Buffer }[]> {
  const { logoBuf, brandName, tagline } = opts;

  const stabilityKey = process.env.STABILITY_API_KEY;
  const openaiKey    = process.env.OPENAI_API_KEY;

  const results = await Promise.all(
    MOCKUPS.map((def) =>
      buildOneMockup(def, logoBuf, brandName, tagline, stabilityKey, openaiKey),
    ),
  );

  return results.filter((r): r is { name: string; buf: Buffer } => r !== null);
}
