/**
 * Dev-mode asset generator — Sharp + SVG, no external services needed.
 * Every design uses the real brand colors extracted from the logo by Claude.
 */

import sharp from "sharp";
import type { BrandData } from "@/lib/types";

/* ── Colour helpers ────────────────────────────────────────────────────── */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function darkenHex(hex: string, amount = 0.5): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * amount)},${Math.round(g * amount)},${Math.round(b * amount)})`;
}

function alphaHex(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Brand context ─────────────────────────────────────────────────────── */

export interface BrandCtx {
  name: string;
  tagline: string;   // ONLY set if user explicitly provided one — never auto-filled
  p: string;   // primary
  s: string;   // secondary
  a: string;   // accent
  p2: string;  // second primary (or secondary)
  dark: string;
  style: string;
  industry: string;
  personality: string;
}

/**
 * @param explicitTagline  Pass the user's own tagline string.
 *                         Pass "" or undefined to suppress tagline from all assets.
 *                         Never pass bd.taglineSuggestions here.
 */
export function makeBrandCtx(brandName: string, bd: BrandData, explicitTagline = ""): BrandCtx {
  const p  = bd.primaryColors[0]?.hex   || "#7c3aed";
  const s  = bd.secondaryColors[0]?.hex || "#06b6d4";
  const a  = bd.accentColors[0]?.hex    || "#fb7185";
  const p2 = bd.primaryColors[1]?.hex   || s;
  return {
    name: brandName || "Brand",
    tagline: explicitTagline,   // never auto-fill from AI suggestions
    p, s, a, p2,
    dark: darkenHex(p, 0.25),
    style: bd.style || "modern",
    industry: bd.industry || "",
    personality: bd.personality?.slice(0, 2).join(" · ") || "",
  };
}

/* ── SVG render helper ─────────────────────────────────────────────────── */

async function svgToBuffer(svg: string, w: number, h: number): Promise<Buffer> {
  return sharp(Buffer.from(svg)).resize(w, h, { fit: "fill" }).png({ quality: 95 }).toBuffer();
}

async function compositeLogo(
  bg: Buffer,
  logoBuffer: Buffer,
  canvasW: number,
  canvasH: number,
  logoMaxSize: number,
  gravity: "center" | "northwest" | "northeast" | "southwest" | "southeast" = "center",
  offsetX = 0,
  offsetY = 0
): Promise<Buffer> {
  const resized = await sharp(logoBuffer)
    .resize(logoMaxSize, logoMaxSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const lw = meta.width || logoMaxSize;
  const lh = meta.height || logoMaxSize;

  let left = Math.round((canvasW - lw) / 2) + offsetX;
  let top  = Math.round((canvasH - lh) / 2) + offsetY;

  if (gravity === "northwest") { left = 40 + offsetX;            top = 40 + offsetY; }
  if (gravity === "northeast") { left = canvasW - lw - 40 + offsetX; top = 40 + offsetY; }
  if (gravity === "southwest") { left = 40 + offsetX;            top = canvasH - lh - 40 + offsetY; }
  if (gravity === "southeast") { left = canvasW - lw - 40 + offsetX; top = canvasH - lh - 40 + offsetY; }

  left = Math.max(0, Math.min(left, canvasW - lw));
  top  = Math.max(0, Math.min(top,  canvasH - lh));

  return sharp(bg).composite([{ input: resized, left, top }]).png().toBuffer();
}

/* ── White logo helper: all visible pixels → white, alpha preserved ──── */

async function toWhiteLogo(logoBuffer: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(logoBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] > 10) out[i] = out[i + 1] = out[i + 2] = 255;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/* ── Auto-select white or original logo based on bg luminance ────────── */
async function selectLogoForBg(logoBuffer: Buffer, bgHex: string): Promise<Buffer> {
  const { r, g, b } = hexToRgb(bgHex);
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma < 148 ? toWhiteLogo(logoBuffer) : logoBuffer;
}

/* ── Dot grid pattern ──────────────────────────────────────────────────── */

function dotGrid(w: number, h: number, color: string, spacing = 32, r = 1.5): string {
  const dots: string[] = [];
  for (let x = spacing / 2; x < w; x += spacing)
    for (let y = spacing / 2; y < h; y += spacing)
      dots.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${color}"/>`);
  return dots.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════════
   LOGO VARIATIONS  (handled upstream via sharp-pipeline, re-exported here
   for convenience)
══════════════════════════════════════════════════════════════════════ */

/** Solid-colour square background for logo variations preview */
export async function makeLogoPreview(
  logoBuffer: Buffer,
  w: number,
  h: number,
  bgHex: string
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${bgHex}"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.04)")}
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, Math.round(Math.min(w, h) * 0.55));
}

/* ═══════════════════════════════════════════════════════════════════════
   BUSINESS CARD (1050 × 600)
══════════════════════════════════════════════════════════════════════ */

export async function makeBusinessCard(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0a0a0a"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.18)}"/>
      </linearGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${ctx.p}"/>
        <stop offset="100%" stop-color="${ctx.s}"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.03)", 28)}
    <!-- Left accent bar -->
    <rect x="0" y="0" width="8" height="${h}" fill="url(#bar)"/>
    <!-- Corner glow -->
    <circle cx="${w}" cy="0" r="${h * 0.9}" fill="${alphaHex(ctx.p, 0.06)}"/>
    <circle cx="${w}" cy="0" r="${h * 0.55}" fill="${alphaHex(ctx.s, 0.05)}"/>
    <!-- Bottom line -->
    <rect x="40" y="${h - 2}" width="${w - 80}" height="1" fill="${alphaHex(ctx.p, 0.4)}"/>
    <!-- Brand name -->
    <text x="48" y="${h - 52}" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="700" fill="white" letter-spacing="1">${escXml(ctx.name.toUpperCase())}</text>
    <!-- Tagline -->
    <!-- Industry badge top-right -->
    <rect x="${w - 160}" y="24" width="136" height="28" rx="14" fill="${alphaHex(ctx.p, 0.18)}" stroke="${alphaHex(ctx.p, 0.4)}" stroke-width="1"/>
    <text x="${w - 92}" y="43" font-family="Arial,Helvetica,sans-serif" font-size="11" fill="${ctx.p}" text-anchor="middle" letter-spacing="0.8">${escXml(ctx.industry.toUpperCase().slice(0, 18))}</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, 180, "northwest", 8, 16);
}

/* ═══════════════════════════════════════════════════════════════════════
   LETTERHEAD A4  (2480 × 3508)
══════════════════════════════════════════════════════════════════════ */

export async function makeLetterhead(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="header" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${ctx.p}"/>
        <stop offset="60%" stop-color="${ctx.s}"/>
        <stop offset="100%" stop-color="${ctx.a}"/>
      </linearGradient>
    </defs>
    <!-- White page -->
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <!-- Header band -->
    <rect x="0" y="0" width="${w}" height="240" fill="url(#header)"/>
    <!-- Subtle dot pattern on header -->
    ${dotGrid(w, 240, "rgba(255,255,255,0.1)", 40, 2)}
    <!-- Header text -->
    <text x="${w - 120}" y="148" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="700" fill="white" text-anchor="end" letter-spacing="2">${escXml(ctx.name.toUpperCase())}</text>
    <!-- Accent line under header -->
    <rect x="0" y="240" width="${w}" height="5" fill="${ctx.a}"/>
    <!-- Content lines (placeholder) -->
    ${Array.from({ length: 18 }, (_, i) => {
      const y = 380 + i * 72;
      const lineW = i === 0 ? w * 0.6 : i % 4 === 3 ? w * 0.35 : w * 0.82;
      const fill = i === 0 ? "#1a1a1a" : "#d0d0d0";
      const h2 = i === 0 ? 28 : 16;
      return `<rect x="160" y="${y}" width="${lineW}" height="${h2}" rx="3" fill="${fill}"/>`;
    }).join("\n")}
    <!-- Footer -->
    <rect x="0" y="${h - 100}" width="${w}" height="4" fill="${alphaHex(ctx.p, 0.3)}"/>
    <text x="160" y="${h - 38}" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="#888888">${escXml(ctx.name)} · ${escXml(ctx.industry)}</text>
    <rect x="0" y="${h - 10}" width="${w}" height="10" fill="${ctx.p}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, 180, "northwest", 100, 28);
}

/* ═══════════════════════════════════════════════════════════════════════
   EMAIL SIGNATURE (600 × 200)
══════════════════════════════════════════════════════════════════════ */

export async function makeEmailSignature(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#ffffff"/>
    <!-- Left accent bar -->
    <rect x="0" y="0" width="4" height="${h}" fill="${ctx.p}"/>
    <rect x="0" y="0" width="4" height="${h / 2}" fill="${ctx.s}"/>
    <!-- Name + title -->
    <text x="220" y="68" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="#111111">${escXml(ctx.name)}</text>
    <text x="220" y="96" font-family="Arial,Helvetica,sans-serif" font-size="13" fill="${ctx.p}">${escXml(ctx.industry)}</text>
    <rect x="220" y="112" width="340" height="1" fill="#e0e0e0"/>
    <text x="220" y="162" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#888888">hello@${escXml(ctx.name.toLowerCase().replace(/\s+/g, ""))}.com</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, 150, "northwest", 40, 24);
}

/* ═══════════════════════════════════════════════════════════════════════
   INVOICE (1240 × 1754)
══════════════════════════════════════════════════════════════════════ */

export async function makeInvoice(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#f9f9f9"/>
    <!-- Top bar -->
    <rect x="0" y="0" width="${w}" height="12" fill="${ctx.p}"/>
    <!-- Header area -->
    <rect x="0" y="12" width="${w}" height="160" fill="#ffffff"/>
    <rect x="0" y="172" width="${w}" height="2" fill="${alphaHex(ctx.p, 0.15)}"/>
    <!-- Invoice label -->
    <text x="${w - 80}" y="100" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="700" fill="${alphaHex(ctx.p, 0.12)}" text-anchor="end">INVOICE</text>
    <text x="${w - 80}" y="148" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#888888" text-anchor="end">#0001</text>
    <!-- Bill info -->
    <text x="80" y="240" font-family="Arial,Helvetica,sans-serif" font-size="13" fill="#888888">BILL TO</text>
    <rect x="80" y="258" width="280" height="16" rx="3" fill="#e5e5e5"/>
    <rect x="80" y="284" width="200" height="14" rx="3" fill="#ebebeb"/>
    <rect x="80" y="308" width="240" height="14" rx="3" fill="#ebebeb"/>
    <!-- Table header -->
    <rect x="0" y="380" width="${w}" height="48" fill="${ctx.p}"/>
    <text x="80" y="412" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="600" fill="white" letter-spacing="1">DESCRIPTION</text>
    <text x="${w - 200}" y="412" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="end">AMOUNT</text>
    <!-- Table rows -->
    ${[0, 1, 2, 3].map(i => `
    <rect x="0" y="${428 + i * 62}" width="${w}" height="62" fill="${i % 2 === 0 ? "#ffffff" : "#fafafa"}"/>
    <rect x="80" y="${448 + i * 62}" width="${w * 0.5}" height="14" rx="3" fill="#e0e0e0"/>
    <rect x="${w - 200}" y="${448 + i * 62}" width="120" height="14" rx="3" fill="${alphaHex(ctx.p, 0.15)}" />
    `).join("")}
    <!-- Total -->
    <rect x="${w * 0.6}" y="${428 + 4 * 62 + 20}" width="${w * 0.4}" height="60" fill="${ctx.p}" rx="4"/>
    <text x="${w - 80}" y="${428 + 4 * 62 + 58}" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="white" text-anchor="end">$ ——.——</text>
    <!-- Footer -->
    <rect x="0" y="${h - 8}" width="${w}" height="8" fill="${ctx.s}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, 160, "northwest", 60, 18);
}

/* ═══════════════════════════════════════════════════════════════════════
   INSTAGRAM POST  (1080 × 1080)
══════════════════════════════════════════════════════════════════════ */

export async function makeInstagramPost(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="30%" cy="30%" r="90%">
        <stop offset="0%"   stop-color="${ctx.p}"/>
        <stop offset="55%"  stop-color="${darkenHex(ctx.p, 0.35)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.s, 0.2)}"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="${alphaHex(ctx.s, 0.35)}"/>
        <stop offset="100%" stop-color="${alphaHex(ctx.s, 0)}"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.05)", 36)}
    <!-- Glow -->
    <ellipse cx="${w / 2}" cy="${h / 2}" rx="420" ry="420" fill="url(#glow)"/>
    <!-- Decorative circles -->
    <circle cx="-60" cy="${h + 60}" r="350" fill="none" stroke="${alphaHex(ctx.a, 0.18)}" stroke-width="2"/>
    <circle cx="-60" cy="${h + 60}" r="250" fill="none" stroke="${alphaHex(ctx.a, 0.12)}" stroke-width="1.5"/>
    <circle cx="${w + 80}" cy="-80" r="380" fill="none" stroke="${alphaHex(ctx.s, 0.15)}" stroke-width="2"/>
    <!-- Top label -->
    <rect x="${w / 2 - 80}" y="48" width="160" height="32" rx="16" fill="${alphaHex("#000", 0.3)}"/>
    <text x="${w / 2}" y="69" font-family="Arial,Helvetica,sans-serif" font-size="13" fill="rgba(255,255,255,0.8)" text-anchor="middle" letter-spacing="1.5">${escXml(ctx.industry.toUpperCase().slice(0, 16))}</text>
    <!-- Bottom name block -->
    <rect x="0" y="${h - 160}" width="${w}" height="160" fill="rgba(0,0,0,0.45)"/>
    <text x="${w / 2}" y="${h - 92}" font-family="Arial,Helvetica,sans-serif" font-size="48" font-weight="700" fill="white" text-anchor="middle" letter-spacing="2">${escXml(ctx.name.toUpperCase())}</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, ctx.p), w, h, Math.round(w * 0.32), "center", 0, -70);
}

/* ═══════════════════════════════════════════════════════════════════════
   INSTAGRAM STORY (1080 × 1920)
══════════════════════════════════════════════════════════════════════ */

export async function makeInstagramStory(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="${ctx.dark}"/>
        <stop offset="40%"  stop-color="${darkenHex(ctx.p, 0.45)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.s, 0.3)}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.04)", 40)}
    <!-- Big arc decoration -->
    <circle cx="${w / 2}" cy="${h * 0.78}" r="${w * 0.85}" fill="none" stroke="${alphaHex(ctx.p, 0.25)}" stroke-width="2"/>
    <circle cx="${w / 2}" cy="${h * 0.78}" r="${w * 0.62}" fill="none" stroke="${alphaHex(ctx.s, 0.15)}" stroke-width="1.5"/>
    <!-- Top brand name -->
    <text x="${w / 2}" y="140" font-family="Arial,Helvetica,sans-serif" font-size="32" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="4">${escXml(ctx.name.toUpperCase())}</text>
    <!-- Accent line under brand name -->
    <rect x="${w / 2 - 60}" y="158" width="120" height="3" rx="2" fill="${ctx.a}"/>
    <!-- CTA block bottom -->
    <rect x="80" y="${h - 260}" width="${w - 160}" height="80" rx="40" fill="${ctx.p}"/>
    <text x="${w / 2}" y="${h - 212}" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="700" fill="white" text-anchor="middle">Get Started →</text>
    <!-- Top progress bars -->
    ${[0, 1, 2, 3].map(i => `<rect x="${60 + i * 252}" y="40" width="228" height="5" rx="3" fill="${i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"}"/>`).join("")}
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, ctx.p), w, h, Math.round(w * 0.4), "center", 0, -Math.round(h * 0.06));
}

/* ═══════════════════════════════════════════════════════════════════════
   LINKEDIN BANNER  (1584 × 396)
══════════════════════════════════════════════════════════════════════ */

export async function makeLinkedInBanner(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0a0a0a"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.3)}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.04)", 28)}
    <!-- Right geometric accent -->
    <circle cx="${w - 100}" cy="${h / 2}" r="${h * 1.1}" fill="${alphaHex(ctx.p, 0.07)}"/>
    <circle cx="${w - 100}" cy="${h / 2}" r="${h * 0.7}" fill="${alphaHex(ctx.s, 0.06)}"/>
    <!-- Left colour bar -->
    <rect x="0" y="0" width="6" height="${h}" fill="${ctx.p}"/>
    <!-- Text block -->
    <text x="200" y="${h / 2 - 20}" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="700" fill="white" letter-spacing="1">${escXml(ctx.name)}</text>
    <!-- Right accent badge -->
    <rect x="${w - 300}" y="${h / 2 - 28}" width="240" height="56" rx="28" fill="${alphaHex(ctx.p, 0.2)}" stroke="${alphaHex(ctx.p, 0.5)}" stroke-width="1.5"/>
    <text x="${w - 180}" y="${h / 2 + 10}" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="${ctx.p}" text-anchor="middle" letter-spacing="1">${escXml(ctx.industry.toUpperCase().slice(0, 16))}</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, "#0a0a0a"), w, h, Math.round(h * 0.55), "northwest", 100, Math.round(h * 0.2));
}

/* ═══════════════════════════════════════════════════════════════════════
   TWITTER / X HEADER (1500 × 500)
══════════════════════════════════════════════════════════════════════ */

export async function makeTwitterHeader(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${darkenHex(ctx.p, 0.3)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.s, 0.3)}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.05)", 30)}
    <circle cx="${w * 0.75}" cy="${h / 2}" r="${h * 1.2}" fill="${alphaHex(ctx.p, 0.08)}"/>
    <text x="${w / 2}" y="${h / 2 + 10}" font-family="Arial,Helvetica,sans-serif" font-size="64" font-weight="700" fill="white" text-anchor="middle" letter-spacing="3" opacity="0.08">${escXml(ctx.name.toUpperCase())}</text>
    <text x="120" y="${h / 2 - 14}" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="700" fill="white" letter-spacing="1">${escXml(ctx.name)}</text>
    <rect x="120" y="${h - 30}" width="60" height="3" rx="2" fill="${ctx.a}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, "#0a0a0a"), w, h, Math.round(h * 0.52), "northeast", 0, Math.round(h * 0.18));
}

/* ═══════════════════════════════════════════════════════════════════════
   YOUTUBE BANNER (2560 × 1440)
══════════════════════════════════════════════════════════════════════ */

export async function makeYoutubeBanner(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#080808"/>
        <stop offset="50%" stop-color="${darkenHex(ctx.p, 0.22)}"/>
        <stop offset="100%" stop-color="#080808"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.04)", 42)}
    <circle cx="${w / 2}" cy="${h * 1.5}" r="${h * 1.4}" fill="${alphaHex(ctx.p, 0.08)}"/>
    <!-- Channel art text -->
    <text x="${w / 2}" y="${h / 2 + 24}" font-family="Arial,Helvetica,sans-serif" font-size="140" font-weight="700" fill="white" text-anchor="middle" letter-spacing="4">${escXml(ctx.name.toUpperCase())}</text>
    <!-- Bottom accent -->
    <rect x="${w / 2 - 120}" y="${h / 2 + 115}" width="240" height="4" rx="2" fill="${ctx.a}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, "#080808"), w, h, Math.round(h * 0.32), "center", 0, -Math.round(h * 0.22));
}

/* ═══════════════════════════════════════════════════════════════════════
   T-SHIRT MOCKUP (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeTshirtMockup(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const s = w / 500;

  // White shirt with brand-color print → always use original logo (shows brand colors)
  // The shirt itself is white/light so the colored logo is perfectly visible
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Studio bg: soft photo-studio gradient -->
      <radialGradient id="bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%"   stop-color="#f0f0f0"/>
        <stop offset="70%"  stop-color="#dedede"/>
        <stop offset="100%" stop-color="#c8c8c8"/>
      </radialGradient>

      <!-- White shirt gradient — directional light top-left -->
      <linearGradient id="shirtBody" x1="0.15" y1="0" x2="0.85" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="#ffffff"/>
        <stop offset="35%"  stop-color="#f8f8f8"/>
        <stop offset="70%"  stop-color="#f0f0f0"/>
        <stop offset="100%" stop-color="#e4e4e4"/>
      </linearGradient>

      <!-- Sleeve shadow shading -->
      <linearGradient id="sleeveL" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="rgba(0,0,0,0.14)"/>
        <stop offset="60%"  stop-color="rgba(0,0,0,0.04)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </linearGradient>
      <linearGradient id="sleeveR" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="rgba(0,0,0,0)"/>
        <stop offset="40%"  stop-color="rgba(0,0,0,0.04)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.16)"/>
      </linearGradient>

      <!-- Collar shadow -->
      <radialGradient id="collarShadow" cx="50%" cy="0%" r="100%">
        <stop offset="0%"   stop-color="rgba(0,0,0,0.18)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </radialGradient>

      <!-- Fabric texture filter -->
      <filter id="fabric" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.72 0.55" numOctaves="4" seed="3" result="noise"/>
        <feColorMatrix type="matrix"
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.06 0"
          in="noise" result="tintNoise"/>
        <feBlend in="SourceGraphic" in2="tintNoise" mode="multiply" result="textured"/>
        <feComposite in="textured" in2="SourceGraphic" operator="in"/>
      </filter>

      <!-- Drop shadow -->
      <filter id="shadow" x="-8%" y="-4%" width="116%" height="122%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${9*s}" result="b"/>
        <feOffset dx="${3*s}" dy="${15*s}" result="o"/>
        <feFlood flood-color="rgba(0,0,0,0.32)" result="c"/>
        <feComposite in="c" in2="o" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>

      <!-- Brand accent color for collar/hem detail -->
    </defs>

    <!-- Studio background -->
    <rect width="${w}" height="${h}" fill="url(#bg)"/>

    <!-- Table/surface edge -->
    <rect x="0" y="${h*0.83}" width="${w}" height="${h*0.17}" fill="rgba(0,0,0,0.05)"/>
    <line x1="0" y1="${h*0.83}" x2="${w}" y2="${h*0.83}" stroke="rgba(0,0,0,0.07)" stroke-width="${1.5*s}"/>

    <!-- Ground shadow -->
    <ellipse cx="${w*0.5}" cy="${h*0.855}" rx="${w*0.33}" ry="${h*0.024}" fill="rgba(0,0,0,0.25)"/>

    <g filter="url(#shadow)">
      <!-- Full shirt body path (more realistic flat-lay shape) -->
      <path d="
        M ${148*s},${94*s}
        C ${132*s},${118*s} ${82*s},${158*s} ${68*s},${172*s}
        L ${4*s},${290*s}
        C ${2*s},${295*s} ${4*s},${301*s} ${9*s},${303*s}
        L ${64*s},${322*s}
        C ${69*s},${324*s} ${74*s},${320*s} ${76*s},${315*s}
        L ${108*s},${234*s}
        L ${108*s},${452*s}
        C ${108*s},${456*s} ${112*s},${460*s} ${116*s},${460*s}
        L ${384*s},${460*s}
        C ${388*s},${460*s} ${392*s},${456*s} ${392*s},${452*s}
        L ${392*s},${234*s}
        L ${424*s},${315*s}
        C ${426*s},${320*s} ${431*s},${324*s} ${436*s},${322*s}
        L ${491*s},${303*s}
        C ${496*s},${301*s} ${498*s},${295*s} ${496*s},${290*s}
        L ${432*s},${172*s}
        C ${418*s},${158*s} ${368*s},${118*s} ${352*s},${94*s}
        C ${326*s},${52*s} ${174*s},${52*s} Z
      " fill="url(#shirtBody)" filter="url(#fabric)"/>

      <!-- Left sleeve directional shadow -->
      <path d="
        M ${148*s},${94*s}
        C ${132*s},${118*s} ${82*s},${158*s} ${68*s},${172*s}
        L ${4*s},${290*s} L ${64*s},${322*s} L ${108*s},${234*s}
        L ${108*s},${168*s} Z
      " fill="url(#sleeveL)" filter="url(#fabric)"/>

      <!-- Right sleeve directional shadow -->
      <path d="
        M ${352*s},${94*s}
        C ${368*s},${118*s} ${418*s},${158*s} ${432*s},${172*s}
        L ${496*s},${290*s} L ${436*s},${322*s} L ${392*s},${234*s}
        L ${392*s},${168*s} Z
      " fill="url(#sleeveR)" filter="url(#fabric)"/>

      <!-- Body mid-crease shadows (fabric fold lines) -->
      <path d="M ${168*s},${200*s} Q ${195*s},${265*s} ${172*s},${330*s}" fill="none" stroke="rgba(0,0,0,0.055)" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M ${332*s},${200*s} Q ${305*s},${265*s} ${328*s},${330*s}" fill="none" stroke="rgba(0,0,0,0.055)" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M ${200*s},${390*s} Q ${250*s},${408*s} ${300*s},${390*s}" fill="none" stroke="rgba(0,0,0,0.04)" stroke-width="${3*s}" stroke-linecap="round"/>
      <path d="M ${220*s},${280*s} Q ${250*s},${295*s} ${280*s},${280*s}" fill="none" stroke="rgba(0,0,0,0.035)" stroke-width="${2.5*s}" stroke-linecap="round"/>

      <!-- Collar area shadow -->
      <path d="M ${176*s},${58*s} C ${176*s},${100*s} ${250*s},${108*s} ${324*s},${58*s}"
            fill="url(#collarShadow)" opacity="0.6"/>

      <!-- Collar (rib-knit style) -->
      <path d="M ${190*s},${56*s} C ${198*s},${88*s} ${222*s},${102*s} ${250*s},${104*s} C ${278*s},${102*s} ${302*s},${88*s} ${310*s},${56*s}"
            fill="#e8e8e8" stroke="#d8d8d8" stroke-width="${2*s}"/>
      <path d="M ${198*s},${57*s} C ${206*s},${86*s} ${228*s},${99*s} ${250*s},${101*s} C ${272*s},${99*s} ${294*s},${86*s} ${302*s},${57*s}"
            fill="none" stroke="#cccccc" stroke-width="${1.5*s}"/>
      <!-- Collar rib lines -->
      ${Array.from({length:6}, (_,i) => {
        const t = 0.15 + i * 0.14;
        const x = 190 + t * 120;
        const y1 = 56 + Math.sin(t * Math.PI) * 48;
        const y2 = y1 + 6;
        return `<line x1="${x*s}" y1="${y1*s}" x2="${x*s}" y2="${y2*s}" stroke="#cccccc" stroke-width="${1.5*s}" opacity="0.7"/>`;
      }).join("")}

      <!-- Brand color hem accent line at bottom -->
      <line x1="${116*s}" y1="${458*s}" x2="${384*s}" y2="${458*s}" stroke="${ctx.p}" stroke-width="${3*s}" opacity="0.7"/>
      <!-- Sleeve cuffs accent -->
      <path d="M ${4*s},${290*s} L ${64*s},${322*s}" stroke="${ctx.p}" stroke-width="${3*s}" opacity="0.5" stroke-linecap="round"/>
      <path d="M ${496*s},${290*s} L ${436*s},${322*s}" stroke="${ctx.p}" stroke-width="${3*s}" opacity="0.5" stroke-linecap="round"/>
    </g>

    <!-- Small brand tag label -->
    <text x="${w/2}" y="${h*0.93}" font-family="Arial,Helvetica,sans-serif" font-size="${14*s}" font-weight="600" fill="rgba(0,0,0,0.35)" text-anchor="middle" letter-spacing="${2*s}">${escXml(ctx.name.toUpperCase())} · APPAREL</text>
  </svg>`;

  const bg = await svgToBuffer(svg, w, h);
  // Use original logo on white shirt — brand colors show perfectly
  return compositeLogo(bg, logoBuffer, w, h, Math.round(w * 0.24), "center", 0, -Math.round(h * 0.07));
}

/* ═══════════════════════════════════════════════════════════════════════
   COFFEE MUG (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeCoffeeMug(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const s = w / 500;
  const cx = 232 * s, cy = 255 * s;
  const mw = 260 * s, mh = 230 * s;
  const rx = 128 * s, ry = 26 * s;
  // White ceramic mug with brand-color accent bands — logo in full color shows beautifully
  const bodyTop    = cy - mh * 0.5;
  const bodyBot    = cy + mh * 0.5;
  const bodyLeft   = cx - rx;
  const bodyRight  = cx + rx;
  const bandH      = mh * 0.22;
  const bandY      = cy - mh * 0.08;  // band sits across middle

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Studio BG -->
      <radialGradient id="bg" cx="48%" cy="36%" r="72%">
        <stop offset="0%"   stop-color="#f2f2f2"/>
        <stop offset="60%"  stop-color="#dcdcdc"/>
        <stop offset="100%" stop-color="#c6c6c6"/>
      </radialGradient>

      <!-- WHITE ceramic cylindrical gradient — dramatic dark-bright-dark left-to-right -->
      <linearGradient id="ceramic" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="#b0b0b0"/>
        <stop offset="10%"  stop-color="#d8d8d8"/>
        <stop offset="28%"  stop-color="#f8f8f8"/>
        <stop offset="44%"  stop-color="#ffffff"/>
        <stop offset="56%"  stop-color="#fafafa"/>
        <stop offset="75%"  stop-color="#e0e0e0"/>
        <stop offset="88%"  stop-color="#c8c8c8"/>
        <stop offset="100%" stop-color="#b8b8b8"/>
      </linearGradient>

      <!-- Brand color band gradient (same cylindrical wrap) -->
      <linearGradient id="band" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.52)}"/>
        <stop offset="10%"  stop-color="${darkenHex(ctx.p, 0.72)}"/>
        <stop offset="28%"  stop-color="${ctx.p}"/>
        <stop offset="50%"  stop-color="${alphaHex(ctx.p, 1)}"/>
        <stop offset="72%"  stop-color="${darkenHex(ctx.p, 0.7)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.5)}"/>
      </linearGradient>

      <!-- Specular glaze highlight strip -->
      <linearGradient id="glaze" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="rgba(255,255,255,0)"/>
        <stop offset="20%"  stop-color="rgba(255,255,255,0.45)"/>
        <stop offset="28%"  stop-color="rgba(255,255,255,0.15)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>

      <!-- Handle gradient -->
      <linearGradient id="hndl" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="#c0c0c0"/>
        <stop offset="40%"  stop-color="#e8e8e8"/>
        <stop offset="100%" stop-color="#b8b8b8"/>
      </linearGradient>

      <!-- Coffee liquid -->
      <radialGradient id="coffee" cx="40%" cy="35%" r="65%">
        <stop offset="0%"   stop-color="#5c3410"/>
        <stop offset="70%"  stop-color="#3a1f06"/>
        <stop offset="100%" stop-color="#2a1504"/>
      </radialGradient>

      <!-- Ceramic surface texture -->
      <filter id="ceramic-tex" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.06 0.35" numOctaves="3" seed="7" result="noise"/>
        <feColorMatrix type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0"
          in="noise" result="n"/>
        <feBlend in="SourceGraphic" in2="n" mode="overlay" result="out"/>
        <feComposite in="out" in2="SourceGraphic" operator="in"/>
      </filter>

      <!-- Drop shadow -->
      <filter id="shadow" x="-18%" y="-5%" width="136%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${8*s}" result="b"/>
        <feOffset dx="${6*s}" dy="${14*s}" result="o"/>
        <feFlood flood-color="rgba(0,0,0,0.3)" result="c"/>
        <feComposite in="c" in2="o" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Studio background -->
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <!-- Table surface -->
    <rect x="0" y="${h*0.74}" width="${w}" height="${h*0.26}" fill="rgba(0,0,0,0.06)"/>
    <line x1="0" y1="${h*0.74}" x2="${w}" y2="${h*0.74}" stroke="rgba(0,0,0,0.09)" stroke-width="${1.5*s}"/>

    <!-- Elongated soft shadow on table -->
    <ellipse cx="${cx + rx*0.12}" cy="${h*0.775}" rx="${rx*1.18}" ry="${ry*0.9}" fill="rgba(0,0,0,0.22)"/>
    <ellipse cx="${cx + rx*0.08}" cy="${h*0.77}"  rx="${rx*0.7}"  ry="${ry*0.5}" fill="rgba(0,0,0,0.12)"/>

    <g filter="url(#shadow)">
      <!-- Handle (draw first so body covers inner edge) -->
      <path d="M ${cx + rx*0.86},${cy - mh*0.28}
               C ${cx + rx*1.72},${cy - mh*0.28}
                 ${cx + rx*1.72},${cy + mh*0.28}
                 ${cx + rx*0.86},${cy + mh*0.28}"
            fill="none" stroke="url(#hndl)" stroke-width="${24*s}" stroke-linecap="butt"/>
      <!-- Handle rim darkening (inner edge) -->
      <path d="M ${cx + rx*0.86},${cy - mh*0.16}
               C ${cx + rx*1.48},${cy - mh*0.16}
                 ${cx + rx*1.48},${cy + mh*0.16}
                 ${cx + rx*0.86},${cy + mh*0.16}"
            fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="${8*s}" stroke-linecap="butt"/>

      <!-- Mug body (slight taper: wider at top) -->
      <path d="M ${bodyLeft - rx*0.05},${bodyTop}
               L ${bodyRight + rx*0.05},${bodyTop}
               L ${bodyRight},${bodyBot}
               L ${bodyLeft},${bodyBot} Z"
            fill="url(#ceramic)" filter="url(#ceramic-tex)"/>

      <!-- Brand color accent band -->
      <path d="M ${bodyLeft - rx*0.04},${bandY}
               L ${bodyRight + rx*0.04},${bandY}
               L ${bodyRight + rx*0.04},${bandY + bandH}
               L ${bodyLeft - rx*0.04},${bandY + bandH} Z"
            fill="url(#band)" filter="url(#ceramic-tex)"/>

      <!-- Glaze specular highlight over whole body -->
      <path d="M ${bodyLeft - rx*0.05},${bodyTop}
               L ${bodyRight + rx*0.05},${bodyTop}
               L ${bodyRight},${bodyBot}
               L ${bodyLeft},${bodyBot} Z"
            fill="url(#glaze)"/>

      <!-- Rim ellipse (top) -->
      <ellipse cx="${cx}" cy="${bodyTop}" rx="${rx*1.05}" ry="${ry}" fill="#c8c8c8"/>
      <!-- Inside rim -->
      <ellipse cx="${cx}" cy="${bodyTop}" rx="${rx*0.88}" ry="${ry*0.78}" fill="url(#coffee)"/>
      <!-- Coffee highlight -->
      <ellipse cx="${cx - rx*0.2}" cy="${bodyTop - ry*0.05}" rx="${rx*0.22}" ry="${ry*0.18}" fill="rgba(255,255,255,0.1)"/>

      <!-- Bottom ellipse (foot ring) -->
      <ellipse cx="${cx}" cy="${bodyBot}" rx="${rx}"      ry="${ry*0.82}" fill="#d0d0d0"/>
      <ellipse cx="${cx}" cy="${bodyBot}" rx="${rx*0.82}" ry="${ry*0.62}" fill="#b8b8b8"/>

      <!-- Left edge accent (shadow band for curvature) -->
      <path d="M ${bodyLeft - rx*0.05},${bodyTop} L ${bodyLeft},${bodyBot}
               L ${bodyLeft + rx*0.1},${bodyBot} L ${bodyLeft + rx*0.1},${bodyTop} Z"
            fill="rgba(0,0,0,0.07)"/>
      <!-- Right edge shadow -->
      <path d="M ${bodyRight - rx*0.1},${bodyTop} L ${bodyRight - rx*0.1},${bodyBot}
               L ${bodyRight},${bodyBot} L ${bodyRight + rx*0.05},${bodyTop} Z"
            fill="rgba(0,0,0,0.08)"/>
    </g>

    <!-- Steam wisps (above coffee surface) -->
    <path d="M ${cx - rx*0.28},${bodyTop - ry*0.8} Q ${cx - rx*0.42},${bodyTop - ry*1.8} ${cx - rx*0.28},${bodyTop - ry*2.8}"
          fill="none" stroke="rgba(200,200,200,0.55)" stroke-width="${3.5*s}" stroke-linecap="round"/>
    <path d="M ${cx + rx*0.05},${bodyTop - ry*1.0} Q ${cx + rx*0.2},${bodyTop - ry*2.1} ${cx + rx*0.05},${bodyTop - ry*3.1}"
          fill="none" stroke="rgba(200,200,200,0.5)"  stroke-width="${3.5*s}" stroke-linecap="round"/>
    <path d="M ${cx + rx*0.36},${bodyTop - ry*0.7} Q ${cx + rx*0.5},${bodyTop - ry*1.7} ${cx + rx*0.36},${bodyTop - ry*2.6}"
          fill="none" stroke="rgba(200,200,200,0.45)" stroke-width="${3*s}"   stroke-linecap="round"/>

    <!-- Label -->
    <text x="${w/2}" y="${h*0.93}" font-family="Arial,Helvetica,sans-serif" font-size="${14*s}" font-weight="600" fill="rgba(0,0,0,0.35)" text-anchor="middle" letter-spacing="${2*s}">${escXml(ctx.name.toUpperCase())} · MUG</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  // Place original logo on the band area
  return compositeLogo(bg, logoBuffer, w, h, Math.round(rx * 1.1), "center", -Math.round(rx * 0.12), -Math.round(mh * 0.06));
}

/* ═══════════════════════════════════════════════════════════════════════
   TOTE BAG (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeToteBag(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const s = w / 500;
  // Use p2 as accent stripe color
  const accentColor = ctx.p2 !== ctx.s ? ctx.p2 : ctx.a;

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stop-color="#edebe6"/>
        <stop offset="55%" stop-color="#d8d5d0"/>
        <stop offset="100%" stop-color="#c0bdb8"/>
      </radialGradient>
      <!-- Canvas bag body — lateral light source from left -->
      <linearGradient id="bagBody" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.48)}"/>
        <stop offset="12%"  stop-color="${darkenHex(ctx.p, 0.72)}"/>
        <stop offset="28%"  stop-color="${ctx.p}"/>
        <stop offset="68%"  stop-color="${ctx.p}"/>
        <stop offset="85%"  stop-color="${darkenHex(ctx.p, 0.72)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.5)}"/>
      </linearGradient>
      <!-- Bag top rim / folded-over band -->
      <linearGradient id="bagRim" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.38)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.52)}"/>
      </linearGradient>
      <!-- Accent stripe using p2 -->
      <linearGradient id="accentStripe" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(accentColor, 0.6)}"/>
        <stop offset="35%"  stop-color="${accentColor}"/>
        <stop offset="100%" stop-color="${darkenHex(accentColor, 0.65)}"/>
      </linearGradient>
      <!-- Canvas texture overlay -->
      <filter id="canvas" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="3" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
        <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="textured"/>
        <feComposite in="textured" in2="SourceGraphic" operator="in"/>
      </filter>
      <!-- Drop shadow -->
      <filter id="shadow" x="-12%" y="-5%" width="124%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${8 * s}" result="b"/>
        <feOffset dx="${4 * s}" dy="${14 * s}" result="o"/>
        <feFlood flood-color="rgba(0,0,0,0.28)" result="c"/>
        <feComposite in="c" in2="o" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <!-- Table surface -->
    <rect x="0" y="${h * 0.80}" width="${w}" height="${h * 0.20}" fill="rgba(0,0,0,0.06)"/>
    <line x1="0" y1="${h * 0.80}" x2="${w}" y2="${h * 0.80}" stroke="rgba(0,0,0,0.08)" stroke-width="${1.5 * s}"/>
    <!-- Ground shadow -->
    <ellipse cx="${w / 2}" cy="${h * 0.83}" rx="${w * 0.27}" ry="${h * 0.02}" fill="rgba(0,0,0,0.2)"/>

    <g filter="url(#shadow)">
      <!-- Cotton strap handles -->
      <path d="M ${152*s},${192*s} C ${138*s},${100*s} ${186*s},${72*s} ${215*s},${72*s}"
            fill="none" stroke="${darkenHex(ctx.p, 0.52)}" stroke-width="${7*s}" stroke-linecap="round"/>
      <path d="M ${348*s},${192*s} C ${362*s},${100*s} ${314*s},${72*s} ${285*s},${72*s}"
            fill="none" stroke="${darkenHex(ctx.p, 0.52)}" stroke-width="${7*s}" stroke-linecap="round"/>
      <!-- Handle top bar -->
      <path d="M ${215*s},${72*s} C ${232*s},${62*s} ${268*s},${62*s} ${285*s},${72*s}"
            fill="none" stroke="${darkenHex(ctx.p, 0.52)}" stroke-width="${7*s}" stroke-linecap="round"/>
      <!-- Handle centre highlight stitch -->
      <path d="M ${152*s},${192*s} C ${138*s},${100*s} ${186*s},${72*s} ${215*s},${72*s}"
            fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="${2*s}" stroke-linecap="round" stroke-dasharray="${5*s} ${4*s}"/>
      <path d="M ${348*s},${192*s} C ${362*s},${100*s} ${314*s},${72*s} ${285*s},${72*s}"
            fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="${2*s}" stroke-linecap="round" stroke-dasharray="${5*s} ${4*s}"/>
      <path d="M ${215*s},${72*s} C ${232*s},${62*s} ${268*s},${62*s} ${285*s},${72*s}"
            fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="${2*s}" stroke-linecap="round" stroke-dasharray="${5*s} ${4*s}"/>

      <!-- Folded rim at top of bag -->
      <rect x="${76*s}" y="${176*s}" width="${348*s}" height="${30*s}" fill="url(#bagRim)" rx="${2*s}"/>
      <!-- Rim bottom shadow line -->
      <line x1="${76*s}" y1="${206*s}" x2="${424*s}" y2="${206*s}" stroke="rgba(0,0,0,0.16)" stroke-width="${2*s}"/>

      <!-- Bag body — natural canvas tote shape (slightly wider at bottom) -->
      <path d="M ${80*s},${206*s}
               L ${68*s},${432*s}
               Q ${68*s},${450*s} ${88*s},${450*s}
               L ${412*s},${450*s}
               Q ${432*s},${450*s} ${432*s},${432*s}
               L ${420*s},${206*s} Z"
            fill="url(#bagBody)"/>

      <!-- Canvas texture — subtle over the body -->
      <path d="M ${80*s},${206*s} L ${68*s},${450*s} L ${432*s},${450*s} L ${420*s},${206*s} Z"
            fill="rgba(0,0,0,0.04)" filter="url(#canvas)"/>

      <!-- Left edge shadow (natural fold shadow) -->
      <path d="M ${80*s},${206*s} L ${68*s},${450*s} L ${108*s},${450*s} L ${118*s},${206*s} Z"
            fill="rgba(0,0,0,0.14)"/>
      <!-- Right edge shadow -->
      <path d="M ${382*s},${206*s} L ${392*s},${450*s} L ${432*s},${450*s} L ${420*s},${206*s} Z"
            fill="rgba(0,0,0,0.16)"/>

      <!-- Vertical centre crease -->
      <line x1="${250*s}" y1="${206*s}" x2="${250*s}" y2="${450*s}"
            stroke="rgba(0,0,0,0.07)" stroke-width="${2*s}"/>

      <!-- Horizontal belly crease (bags sag naturally) -->
      <path d="M ${76*s},${342*s} Q ${250*s},${358*s} ${424*s},${342*s}"
            fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="${2.5*s}"/>

      <!-- Accent stripe near bottom -->
      <rect x="${68*s}" y="${415*s}" width="${364*s}" height="${22*s}"
            fill="url(#accentStripe)" rx="${0*s}"/>

      <!-- Bottom gusset fold line -->
      <path d="M ${68*s},${436*s} Q ${250*s},${446*s} ${432*s},${436*s}"
            fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="${1.5*s}"/>

      <!-- Left specular sheen (canvas gloss) -->
      <path d="M ${80*s},${206*s} L ${118*s},${206*s} L ${106*s},${450*s} L ${68*s},${450*s} Z"
            fill="rgba(255,255,255,0.07)"/>
    </g>

    <text x="${w / 2}" y="${h * 0.93}" font-family="Arial,Helvetica,sans-serif" font-size="${14 * s}" font-weight="600" fill="rgba(0,0,0,0.36)" text-anchor="middle" letter-spacing="${2 * s}">${escXml(ctx.name.toUpperCase())} · TOTE</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  const logo = await selectLogoForBg(logoBuffer, ctx.p);
  return compositeLogo(bg, logo, w, h, Math.round(w * 0.44), "center", 0, -Math.round(h * 0.06));
}

/* ═══════════════════════════════════════════════════════════════════════
   STOREFRONT SIGN (1920 × 1080)
══════════════════════════════════════════════════════════════════════ */

export async function makeStorefrontSign(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Night sky gradient -->
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="#060d18"/>
        <stop offset="70%"  stop-color="#0d1928"/>
        <stop offset="100%" stop-color="#111f30"/>
      </linearGradient>
      <!-- Sign band gradient -->
      <linearGradient id="sign" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.7)}"/>
        <stop offset="30%"  stop-color="${ctx.p}"/>
        <stop offset="70%"  stop-color="${ctx.s}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.s, 0.7)}"/>
      </linearGradient>
      <!-- Sign glow -->
      <filter id="signGlow" x="-5%" y="-20%" width="110%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${h*0.012}" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Window glow -->
      <filter id="winGlow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Awning gradient -->
      <linearGradient id="awning" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${ctx.p}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.6)}"/>
      </linearGradient>
    </defs>

    <!-- Sky -->
    <rect width="${w}" height="${h}" fill="url(#sky)"/>

    <!-- Stars -->
    ${Array.from({length:40}, (_,i) => {
      const sx = (i * 137 + 23) % w;
      const sy = (i * 97 + 11) % (h * 0.35);
      const sr = 0.5 + (i % 4) * 0.4;
      const op = 0.3 + (i % 5) * 0.12;
      return `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${sr}" fill="rgba(255,255,255,${op.toFixed(2)})"/>`;
    }).join("")}

    <!-- Moon -->
    <circle cx="${w*0.88}" cy="${h*0.1}" r="${h*0.05}" fill="rgba(255,245,200,0.85)"/>
    <circle cx="${w*0.895}" cy="${h*0.09}" r="${h*0.042}" fill="#060d18"/>

    <!-- Background buildings (silhouette) -->
    <rect x="0"        y="${h*0.22}" width="${w*0.12}" height="${h*0.6}"  fill="#0b1520"/>
    <rect x="${w*0.06}" y="${h*0.12}" width="${w*0.08}" height="${h*0.7}"  fill="#0c1828"/>
    <rect x="${w*0.86}" y="${h*0.16}" width="${w*0.08}" height="${h*0.66}" fill="#0b1520"/>
    <rect x="${w*0.9}"  y="${h*0.08}" width="${w*0.1}"  height="${h*0.74}" fill="#0c1828"/>

    <!-- Pavement -->
    <rect x="0" y="${h*0.88}" width="${w}" height="${h*0.12}" fill="#0e1520"/>
    <rect x="0" y="${h*0.87}" width="${w}" height="${h*0.015}" fill="#141c2a"/>

    <!-- Main building facade -->
    <rect x="${w*0.1}" y="${h*0.15}" width="${w*0.8}" height="${h*0.73}" fill="#0f1b2a" stroke="#182638" stroke-width="2"/>

    <!-- Building edge details -->
    <rect x="${w*0.1}"  y="${h*0.15}" width="${w*0.015}" height="${h*0.73}" fill="#0c1522"/>
    <rect x="${w*0.885}" y="${h*0.15}" width="${w*0.015}" height="${h*0.73}" fill="#0c1522"/>

    <!-- Cornice top detail -->
    <rect x="${w*0.1}" y="${h*0.14}" width="${w*0.8}" height="${h*0.025}" fill="#1a2840" stroke="#223450" stroke-width="1"/>

    <!-- Window rows above sign -->
    ${[0,1].map(row => [0,1,2,3].map(col =>
      `<rect x="${w*(0.155 + col*0.175)}" y="${h*(0.19 + row*0.09)}" width="${w*0.11}" height="${h*0.062}"
             rx="3" fill="${alphaHex(ctx.s, 0.12)}" stroke="${alphaHex(ctx.s, 0.2)}" stroke-width="1"/>
       <rect x="${w*(0.155 + col*0.175)}" y="${h*(0.19 + row*0.09)}" width="${w*0.11}" height="${h*0.062}"
             rx="3" fill="rgba(255,220,100,0.04)" filter="url(#winGlow)"/>`
    ).join("")).join("")}

    <!-- Window rows below sign -->
    ${[0,1].map(row => [0,1,2,3].map(col =>
      `<rect x="${w*(0.155 + col*0.175)}" y="${h*(0.655 + row*0.09)}" width="${w*0.11}" height="${h*0.062}"
             rx="3" fill="${alphaHex(ctx.s, 0.1)}" stroke="${alphaHex(ctx.s, 0.18)}" stroke-width="1"/>`
    ).join("")).join("")}

    <!-- Sign band with glow -->
    <rect x="${w*0.1}"  y="${h*0.42}" width="${w*0.8}" height="${h*0.215}" fill="url(#sign)" filter="url(#signGlow)"/>

    <!-- Sign inner border -->
    <rect x="${w*0.105}" y="${h*0.425}" width="${w*0.79}" height="${h*0.205}" rx="2"
          fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>

    <!-- Sign: logo zone (left 28%) + divider + text (right 72%) -->
    <!-- Vertical divider inside sign -->
    <line x1="${w*0.345}" y1="${h*0.435}" x2="${w*0.345}" y2="${h*0.615}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

    <!-- Brand name right-of-divider -->
    <text x="${w*0.62}" y="${h*0.548}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.068}" font-weight="700"
          fill="white" text-anchor="middle" letter-spacing="4">${escXml(ctx.name.toUpperCase())}</text>

    <!-- Sign light strip top -->
    <rect x="${w*0.1}" y="${h*0.42}" width="${w*0.8}" height="${h*0.008}" fill="rgba(255,255,255,0.2)"/>

    <!-- Entrance door -->
    <rect x="${w*0.415}" y="${h*0.72}" width="${w*0.17}" height="${h*0.16}" rx="3" fill="#0a1220" stroke="#1a2840" stroke-width="1.5"/>
    <rect x="${w*0.415}" y="${h*0.72}" width="${w*0.085}" height="${h*0.16}" rx="3" fill="${alphaHex(ctx.s, 0.08)}"/>
    <!-- Door handle -->
    <circle cx="${w*0.498}" cy="${h*0.8}" r="${h*0.008}" fill="#c0a060"/>

    <!-- Awning over door (use secondary/accent color, not black primary) -->
    <path d="M ${w*0.4},${h*0.718} L ${w*0.6},${h*0.718} L ${w*0.58},${h*0.76} L ${w*0.42},${h*0.76} Z"
          fill="${ctx.s}"/>
    <!-- Awning scallop edge -->
    ${[0,1,2,3].map(i => `<path d="M ${w*(0.42+i*0.045)},${h*0.76} Q ${w*(0.4425+i*0.045)},${h*0.775} ${w*(0.465+i*0.045)},${h*0.76}" fill="${darkenHex(ctx.s, 0.7)}"/>`).join("")}

    <!-- Ground puddle reflection -->
    <ellipse cx="${w/2}" cy="${h*0.91}" rx="${w*0.35}" ry="${h*0.025}" fill="${alphaHex(ctx.s, 0.15)}"/>
    <!-- Pavement lines -->
    <line x1="${w*0.15}" y1="${h*0.895}" x2="${w*0.38}" y2="${h*0.9}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="${w*0.55}" y1="${h*0.892}" x2="${w*0.85}" y2="${h*0.9}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  const logo = await toWhiteLogo(logoBuffer);
  // Place white logo in LEFT zone of sign band
  return compositeLogo(bg, logo, w, h, Math.round(h * 0.155), "center", -Math.round(w * 0.29), -Math.round(h * 0.005));
}

/* ═══════════════════════════════════════════════════════════════════════
   BILLBOARD (3000 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeBillboard(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="#050c18"/>
        <stop offset="55%"  stop-color="#0c1828"/>
        <stop offset="100%" stop-color="#111f2e"/>
      </linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="#090909"/>
        <stop offset="40%"  stop-color="${darkenHex(ctx.p, 0.3)}"/>
        <stop offset="100%" stop-color="#080808"/>
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="${h*0.12}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0e1825"/>
        <stop offset="100%" stop-color="#080f18"/>
      </linearGradient>
      <!-- Spot light glow from billboard lamps -->
      <radialGradient id="lampGlow" cx="50%" cy="0%" r="100%">
        <stop offset="0%"   stop-color="${alphaHex(ctx.p, 0.15)}"/>
        <stop offset="100%" stop-color="${alphaHex(ctx.p, 0)}"/>
      </radialGradient>
      <filter id="glow" x="-10%" y="-30%" width="120%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${h*0.008}" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Sky -->
    <rect width="${w}" height="${h}" fill="url(#sky)"/>

    <!-- Stars (deterministic) -->
    ${Array.from({length:60}, (_,i) => {
      const sx = (i * 239 + 47) % w;
      const sy = (i * 113 + 19) % (h * 0.65);
      const sr = 0.5 + (i % 3) * 0.5;
      const op = 0.2 + (i % 6) * 0.08;
      return `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${sr}" fill="rgba(255,255,255,${op.toFixed(2)})"/>`;
    }).join("")}

    <!-- City skyline silhouette -->
    <rect x="0"         y="${h*0.62}" width="${w*0.07}"  height="${h*0.3}"  fill="#0b1522"/>
    <rect x="${w*0.05}"  y="${h*0.52}" width="${w*0.04}"  height="${h*0.4}"  fill="#0d1828"/>
    <rect x="${w*0.08}"  y="${h*0.58}" width="${w*0.03}"  height="${h*0.34}" fill="#0b1522"/>
    <rect x="${w*0.88}"  y="${h*0.55}" width="${w*0.05}"  height="${h*0.37}" fill="#0b1522"/>
    <rect x="${w*0.92}"  y="${h*0.48}" width="${w*0.04}"  height="${h*0.44}" fill="#0d1828"/>
    <rect x="${w*0.95}"  y="${h*0.6}"  width="${w*0.05}"  height="${h*0.32}" fill="#0b1522"/>

    <!-- Ground -->
    <rect x="0" y="${h*0.88}" width="${w}" height="${h*0.12}" fill="url(#ground)"/>
    <line x1="0" y1="${h*0.88}" x2="${w}" y2="${h*0.88}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

    <!-- Road markings -->
    ${[0,1,2,3,4,5].map(i => `<rect x="${w*(0.1+i*0.135)}" y="${h*0.94}" width="${w*0.07}" height="${h*0.012}" rx="2" fill="rgba(255,255,255,0.06)"/>`).join("")}

    <!-- Billboard posts -->
    <rect x="${w*0.345}" y="${h*0.56}" width="${w*0.022}" height="${h*0.32}" rx="3" fill="#1a2438"/>
    <rect x="${w*0.633}" y="${h*0.56}" width="${w*0.022}" height="${h*0.32}" rx="3" fill="#1a2438"/>
    <!-- Cross brace -->
    <rect x="${w*0.345}" y="${h*0.72}" width="${w*0.31}" height="${h*0.018}" rx="3" fill="#151f2e"/>

    <!-- Billboard frame (thick bezel) -->
    <rect x="${w*0.08}" y="${h*0.08}" width="${w*0.84}" height="${h*0.49}" rx="8" fill="#0e1520" stroke="#1a2a3a" stroke-width="3"/>

    <!-- Glow cast by billboard lights -->
    <rect x="${w*0.08}" y="${h*0.57}" width="${w*0.84}" height="${h*0.2}" fill="url(#lampGlow)" opacity="0.8"/>

    <!-- Billboard face -->
    <rect x="${w*0.095}" y="${h*0.1}" width="${w*0.81}" height="${h*0.45}" rx="4" fill="url(#panel)"/>

    <!-- Panel inner corner braces -->
    <rect x="${w*0.095}" y="${h*0.1}"  width="${w*0.03}" height="${h*0.03}" rx="3" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.875}" y="${h*0.1}"  width="${w*0.03}" height="${h*0.03}" rx="3" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.095}" y="${h*0.52}" width="${w*0.03}" height="${h*0.03}" rx="3" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.875}" y="${h*0.52}" width="${w*0.03}" height="${h*0.03}" rx="3" fill="rgba(255,255,255,0.05)"/>

    <!-- Billboard: logo left zone + divider + text right zone -->
    <!-- Vertical divider -->
    <line x1="${w*0.42}" y1="${h*0.13}" x2="${w*0.42}" y2="${h*0.52}" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>

    <!-- Brand name (right zone) -->
    <text x="${w*0.72}" y="${h*0.31}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.115}" font-weight="700"
          fill="white" text-anchor="middle" letter-spacing="4" filter="url(#glow)">${escXml(ctx.name.toUpperCase())}</text>
    <!-- Accent line under name -->
    <rect x="${w*0.56}" y="${h*0.335}" width="${w*0.32}" height="${h*0.006}" rx="3" fill="${ctx.a}" opacity="0.8"/>

    <!-- Billboard lamp fixtures (top) -->
    ${[0,1,2,3,4,5].map(i =>
      `<rect x="${w*(0.105+i*0.135)}" y="${h*0.096}" width="${w*0.05}" height="${h*0.014}" rx="3" fill="#1e2d3a"/>
       <ellipse cx="${w*(0.13+i*0.135)}" cy="${h*0.103}" rx="${w*0.015}" ry="${h*0.008}" fill="${ctx.a}" opacity="0.9" filter="url(#glow)"/>`
    ).join("")}

    <!-- Road reflection -->
    <ellipse cx="${w/2}" cy="${h*0.92}" rx="${w*0.3}" ry="${h*0.022}" fill="${alphaHex(ctx.s, 0.12)}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  const logo = await toWhiteLogo(logoBuffer);
  // Logo in left zone of billboard panel
  return compositeLogo(bg, logo, w, h, Math.round(h * 0.28), "center", -Math.round(w * 0.305), -Math.round(h * 0.09));
}

/* ═══════════════════════════════════════════════════════════════════════
   ROLL-UP BANNER (1080 × 2400)
══════════════════════════════════════════════════════════════════════ */

export async function makeRollupBanner(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0a0a0a"/>
        <stop offset="45%" stop-color="${darkenHex(ctx.p, 0.35)}"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.04)", 36)}
    <!-- Decorative arcs -->
    <circle cx="${w/2}" cy="${h*0.35}" r="${w*0.75}" fill="none" stroke="${alphaHex(ctx.p, 0.15)}" stroke-width="2"/>
    <circle cx="${w/2}" cy="${h*0.35}" r="${w*0.52}" fill="none" stroke="${alphaHex(ctx.s, 0.1)}" stroke-width="1.5"/>
    <!-- Colour bar at top -->
    <rect x="0" y="0" width="${w}" height="${h*0.008}" fill="${ctx.p}"/>
    <rect x="0" y="${h*0.008}" width="${w}" height="${h*0.004}" fill="${ctx.s}"/>
    <!-- Brand name large -->
    <text x="${w/2}" y="${h*0.62}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.12}" font-weight="700" fill="white" text-anchor="middle" letter-spacing="3">${escXml(ctx.name.toUpperCase())}</text>
    <rect x="${w/2 - 80}" y="${h*0.635}" width="160" height="4" rx="2" fill="${ctx.a}"/>
    <!-- Tagline -->
    <!-- Bottom contact -->
    <text x="${w/2}" y="${h*0.95}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.038}" fill="${alphaHex("#ffffff",0.35)}" text-anchor="middle">${escXml(ctx.name.toLowerCase().replace(/\s+/g,"")+".com")}</text>
    <!-- Base bar -->
    <rect x="0" y="${h*0.97}" width="${w}" height="${h*0.03}" fill="${darkenHex(ctx.p, 0.5)}"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, "#0a0a0a"), w, h, Math.round(w * 0.42), "center", 0, -Math.round(h * 0.17));
}

/* ═══════════════════════════════════════════════════════════════════════
   WEBSITE HERO (1920 × 1080)
══════════════════════════════════════════════════════════════════════ */

export async function makeWebsiteHero(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="35%" cy="35%" r="80%">
        <stop offset="0%"   stop-color="#111111"/>
        <stop offset="60%"  stop-color="#0a0a0a"/>
        <stop offset="100%" stop-color="#060606"/>
      </radialGradient>
      <radialGradient id="glow1" cx="30%" cy="40%" r="40%">
        <stop offset="0%" stop-color="${alphaHex(ctx.p, 0.18)}"/>
        <stop offset="100%" stop-color="${alphaHex(ctx.p, 0)}"/>
      </radialGradient>
      <radialGradient id="glow2" cx="70%" cy="60%" r="35%">
        <stop offset="0%" stop-color="${alphaHex(ctx.s, 0.13)}"/>
        <stop offset="100%" stop-color="${alphaHex(ctx.s, 0)}"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow1)"/>
    <rect width="${w}" height="${h}" fill="url(#glow2)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.035)", 36)}
    <!-- Nav bar mockup -->
    <rect x="0" y="0" width="${w}" height="${h*0.07}" fill="rgba(0,0,0,0.5)"/>
    <rect x="${w*0.04}" y="${h*0.024}" width="${w*0.07}" height="${h*0.022}" rx="4" fill="${alphaHex(ctx.p, 0.6)}"/>
    ${[0.5,0.56,0.62].map(x=>`<rect x="${w*x}" y="${h*0.026}" width="${w*0.048}" height="${h*0.018}" rx="3" fill="rgba(255,255,255,0.12)"/>`).join("")}
    <rect x="${w*0.86}" y="${h*0.022}" width="${w*0.09}" height="${h*0.026}" rx="${h*0.013}" fill="${ctx.p}"/>
    <!-- Headline copy -->
    <text x="${w*0.06}" y="${h*0.42}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.088}" font-weight="700" fill="white" letter-spacing="-1">${escXml(ctx.name)}</text>
    <!-- CTA button -->
    <rect x="${w*0.06}" y="${h*0.59}" width="${w*0.18}" height="${h*0.07}" rx="${h*0.035}" fill="${ctx.p}"/>
    <text x="${w*0.06 + w*0.09}" y="${h*0.635}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.028}" font-weight="600" fill="white" text-anchor="middle">Get Started →</text>
    <!-- Right side abstract UI mockup -->
    <rect x="${w*0.56}" y="${h*0.12}" width="${w*0.38}" height="${h*0.72}" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    ${[0,1,2,3].map(i=>`<rect x="${w*0.585}" y="${h*(0.16+i*0.14)}" width="${w*0.33}" height="${h*0.09}" rx="8" fill="${alphaHex(ctx.p, 0.08)}" stroke="${alphaHex(ctx.p, 0.15)}" stroke-width="1"/>`).join("")}
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, Math.round(h * 0.16), "northwest", Math.round(w * 0.04), Math.round(h * 0.09));
}

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE APP SCREEN (1242 × 2688)
══════════════════════════════════════════════════════════════════════ */

export async function makeMobileApp(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const frameR = w * 0.12;
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0a0a0a"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.22)}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${darkenHex(ctx.s, 0.2)}"/>
    <!-- Phone frame -->
    <rect x="${w*0.05}" y="${h*0.02}" width="${w*0.9}" height="${h*0.96}" rx="${frameR}" fill="#111111" stroke="#222222" stroke-width="3"/>
    <!-- Screen -->
    <rect x="${w*0.07}" y="${h*0.04}" width="${w*0.86}" height="${h*0.92}" rx="${frameR*0.7}" fill="url(#bg)"/>
    ${dotGrid(w*0.86, h*0.92, "rgba(255,255,255,0.03)", 30)}
    <!-- Status bar -->
    <rect x="${w*0.07}" y="${h*0.04}" width="${w*0.86}" height="${h*0.04}" rx="${frameR*0.7}" fill="rgba(0,0,0,0.4)"/>
    <!-- Notch -->
    <rect x="${w*0.35}" y="${h*0.04}" width="${w*0.3}" height="${h*0.03}" rx="${h*0.015}" fill="#111111"/>
    <!-- App header -->
    <rect x="${w*0.07}" y="${h*0.08}" width="${w*0.86}" height="${h*0.1}" fill="${ctx.p}"/>
    <text x="${w*0.5}" y="${h*0.143}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.055}" font-weight="700" fill="white" text-anchor="middle">${escXml(ctx.name)}</text>
    <!-- Content blocks -->
    ${[0,1,2,3].map(i=>`<rect x="${w*0.1}" y="${h*(0.22+i*0.15)}" width="${w*0.8}" height="${h*0.1}" rx="10" fill="${alphaHex(ctx.p, 0.08)}" stroke="${alphaHex(ctx.p, 0.15)}" stroke-width="1"/>`).join("")}
    <!-- Bottom nav -->
    <rect x="${w*0.07}" y="${h*0.88}" width="${w*0.86}" height="${h*0.075}" fill="rgba(0,0,0,0.6)"/>
    ${[0.18,0.37,0.56,0.75].map(x=>`<circle cx="${w*(0.07+x*0.86)}" cy="${h*0.918}" r="${w*0.04}" fill="${alphaHex(ctx.p, 0.3)}"/>`).join("")}
    <!-- Home indicator -->
    <rect x="${w*0.38}" y="${h*0.962}" width="${w*0.24}" height="${h*0.008}" rx="${h*0.004}" fill="rgba(255,255,255,0.35)"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, Math.round(w * 0.14), "northwest", Math.round(w*0.07), Math.round(h*0.08));
}

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT BOX – isometric (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeProductBox(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const s = w / 500;
  const bx = 250 * s, by = 270 * s;
  const bw = 155 * s, bh = 90 * s, bd = 200 * s;

  const top  = `${bx},${by - bh}`;
  const topR = `${bx + bw},${by - bh + bh * 0.5}`;
  const topL = `${bx - bw},${by - bh + bh * 0.5}`;
  const midR = `${bx + bw},${by - bh + bh * 0.5 + bd}`;
  const midL = `${bx - bw},${by - bh + bh * 0.5 + bd}`;
  const bot  = `${bx},${by - bh + bh + bd}`;

  // Use p2 (second primary) as accent; fall back to accent color
  const accentColor = ctx.p2 !== ctx.s ? ctx.p2 : ctx.a;

  // Contrast color for text/logo on the primary face
  const { r: pr, g: pg, b: pb } = hexToRgb(ctx.p);
  const pLuma = 0.299 * pr + 0.587 * pg + 0.114 * pb;
  const onPrimary = pLuma < 140 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)";

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="boxBg" cx="50%" cy="38%" r="68%">
        <stop offset="0%" stop-color="#f0eee9"/>
        <stop offset="55%" stop-color="#dedad5"/>
        <stop offset="100%" stop-color="#c8c4bf"/>
      </radialGradient>
      <!-- Left face = brand primary (main display) -->
      <linearGradient id="leftFace" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.58)}"/>
        <stop offset="22%"  stop-color="${ctx.p}"/>
        <stop offset="80%"  stop-color="${darkenHex(ctx.p, 0.8)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.62)}"/>
      </linearGradient>
      <!-- Right face = neutral grey shadow (NOT brand secondary — keeps box readable for any brand) -->
      <linearGradient id="rightFace" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="#a8a8a2"/>
        <stop offset="55%"  stop-color="#929290"/>
        <stop offset="100%" stop-color="#828280"/>
      </linearGradient>
      <!-- Top face = bright highlight -->
      <linearGradient id="topFace" x1="0" y1="0" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="#ffffff"/>
        <stop offset="65%"  stop-color="#f2efea"/>
        <stop offset="100%" stop-color="#e5e2dd"/>
      </linearGradient>
      <!-- Accent stripe (p2) on left face -->
      <linearGradient id="accentBand" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(accentColor, 0.6)}"/>
        <stop offset="38%"  stop-color="${accentColor}"/>
        <stop offset="100%" stop-color="${darkenHex(accentColor, 0.68)}"/>
      </linearGradient>
      <!-- Box drop shadow -->
      <filter id="boxShadow" x="-20%" y="-10%" width="140%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${10 * s}" result="b"/>
        <feOffset dx="${6 * s}" dy="${16 * s}" result="o"/>
        <feFlood flood-color="rgba(0,0,0,0.32)" result="c"/>
        <feComposite in="c" in2="o" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <!-- Clip accent stripe to left face polygon -->
      <clipPath id="boxLeftClip">
        <polygon points="${topL} ${bx},${by} ${bot} ${midL}"/>
      </clipPath>
    </defs>

    <!-- Studio BG -->
    <rect width="${w}" height="${h}" fill="url(#boxBg)"/>
    <rect x="0" y="${h * 0.76}" width="${w}" height="${h * 0.24}" fill="rgba(0,0,0,0.06)"/>
    <line x1="0" y1="${h * 0.76}" x2="${w}" y2="${h * 0.76}" stroke="rgba(0,0,0,0.08)" stroke-width="${1.5 * s}"/>
    <ellipse cx="${bx + bw * 0.12}" cy="${h * 0.795}" rx="${bw * 1.35}" ry="${bh * 0.52}" fill="rgba(0,0,0,0.18)"/>

    <g filter="url(#boxShadow)">
      <!-- Left face (brand primary color) -->
      <polygon points="${topL} ${bx},${by} ${bot} ${midL}" fill="url(#leftFace)"/>

      <!-- Accent stripe near bottom of left face using p2 color -->
      <rect x="${bx - bw}" y="${by + bd * 0.68}" width="${bw}" height="${bd * 0.2}"
            fill="url(#accentBand)" clip-path="url(#boxLeftClip)"/>

      <!-- Left face subtle top-left shine -->
      <polygon points="${topL} ${bx - bw * 0.3},${by - bh * 0.5 + bh * 0.85} ${bx - bw * 0.42},${by + bd * 0.42} ${midL}"
               fill="rgba(255,255,255,0.06)"/>

      <!-- Right face (neutral grey shadow) -->
      <polygon points="${bx},${by} ${topR} ${midR} ${bot}" fill="url(#rightFace)"/>

      <!-- Right face brand name -->
      <text
        x="${bx + bw * 0.52}"
        y="${by + bd * 0.48}"
        font-family="Arial,Helvetica,sans-serif"
        font-size="${19 * s}"
        font-weight="700"
        fill="rgba(255,255,255,0.82)"
        text-anchor="middle"
        letter-spacing="${1.5 * s}"
      >${escXml(ctx.name.toUpperCase())}</text>

      <!-- Right face decorative line below text -->
      <line x1="${bx + bw * 0.12}" y1="${by + bd * 0.56}" x2="${bx + bw * 0.9}" y2="${by + bd * 0.56 + bh * 0.2}"
            stroke="rgba(255,255,255,0.22)" stroke-width="${2 * s}"/>

      <!-- Top face (bright highlight) -->
      <polygon points="${top} ${topR} ${bx},${by} ${topL}" fill="url(#topFace)"/>

      <!-- Top edge bright crease lines -->
      <line x1="${bx - bw}" y1="${by - bh * 0.5}" x2="${bx}" y2="${by - bh}" stroke="rgba(255,255,255,0.7)" stroke-width="${1.5 * s}"/>
      <line x1="${bx}" y1="${by - bh}" x2="${bx + bw}" y2="${by - bh * 0.5}" stroke="rgba(255,255,255,0.5)" stroke-width="${1 * s}"/>

      <!-- Top face inner shine -->
      <polygon points="${top} ${bx + bw * 0.38},${by - bh + bh * 0.35} ${bx},${by - bh + bh * 0.88} ${topL}"
               fill="rgba(255,255,255,0.22)"/>
    </g>

    <text x="${w / 2}" y="${h * 0.93}" font-family="Arial,Helvetica,sans-serif" font-size="${14 * s}" font-weight="600" fill="rgba(0,0,0,0.38)" text-anchor="middle" letter-spacing="${2 * s}">${escXml(ctx.name.toUpperCase())} · PACKAGING</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  const logo = await selectLogoForBg(logoBuffer, ctx.p);
  return compositeLogo(bg, logo, w, h, Math.round(bw * 0.85), "center", -Math.round(bw * 0.62), Math.round(bd * 0.1));
}

/* ═══════════════════════════════════════════════════════════════════════
   SHOPPING BAG (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeShoppingBag(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const s = w / 500;
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#efefef"/>
        <stop offset="55%" stop-color="#d9d9d9"/>
        <stop offset="100%" stop-color="#c2c2c2"/>
      </radialGradient>
      <!-- Glossy bag gradient (light source top-left) -->
      <linearGradient id="bagFront" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${alphaHex(ctx.p, 1)}"/>
        <stop offset="55%"  stop-color="${ctx.p}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.55)}"/>
      </linearGradient>
      <!-- Top fold panel -->
      <linearGradient id="topPanel" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="${darkenHex(ctx.p, 0.4)}"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.55)}"/>
      </linearGradient>
      <!-- Tissue paper gradient -->
      <linearGradient id="tissue" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%"   stop-color="rgba(255,255,255,0.92)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.5)"/>
      </linearGradient>
      <!-- Drop shadow -->
      <filter id="shadow" x="-12%" y="-5%" width="124%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${8*s}" result="b"/>
        <feOffset dx="${5*s}" dy="${14*s}" result="o"/>
        <feFlood flood-color="rgba(0,0,0,0.3)" result="c"/>
        <feComposite in="c" in2="o" operator="in" result="s"/>
        <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Studio bg -->
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <!-- Table surface -->
    <rect x="0" y="${h*0.8}" width="${w}" height="${h*0.2}" fill="rgba(0,0,0,0.07)"/>
    <line x1="0" y1="${h*0.8}" x2="${w}" y2="${h*0.8}" stroke="rgba(0,0,0,0.09)" stroke-width="${1.5*s}"/>
    <!-- Ground shadow -->
    <ellipse cx="${w/2}" cy="${h*0.83}" rx="${w*0.26}" ry="${h*0.022}" fill="rgba(0,0,0,0.22)"/>

    <g filter="url(#shadow)">
      <!-- Cord handles (twisted) -->
      <path d="M ${170*s},${130*s} C ${162*s},${72*s} ${192*s},${52*s} ${220*s},${52*s}"
            fill="none" stroke="#2a1f14" stroke-width="${6*s}" stroke-linecap="round"/>
      <path d="M ${330*s},${130*s} C ${338*s},${72*s} ${308*s},${52*s} ${280*s},${52*s}"
            fill="none" stroke="#2a1f14" stroke-width="${6*s}" stroke-linecap="round"/>
      <!-- Handle bar -->
      <path d="M ${220*s},${52*s} C ${235*s},${44*s} ${265*s},${44*s} ${280*s},${52*s}"
            fill="none" stroke="#2a1f14" stroke-width="${6*s}" stroke-linecap="round"/>

      <!-- Bag top fold -->
      <rect x="${98*s}" y="${118*s}" width="${304*s}" height="${42*s}" rx="${3*s}" fill="url(#topPanel)"/>
      <!-- Top fold shadow line -->
      <line x1="${98*s}" y1="${160*s}" x2="${402*s}" y2="${160*s}" stroke="rgba(0,0,0,0.14)" stroke-width="${2*s}"/>

      <!-- Bag body (slight taper for 3D feel) -->
      <path d="M ${98*s},${160*s} L ${90*s},${440*s} Q ${90*s},${456*s} ${106*s},${456*s} L ${394*s},${456*s} Q ${410*s},${456*s} ${410*s},${440*s} L ${402*s},${160*s} Z"
            fill="url(#bagFront)"/>

      <!-- Left edge shadow -->
      <path d="M ${98*s},${160*s} L ${90*s},${456*s} L ${128*s},${456*s} L ${132*s},${160*s} Z"
            fill="rgba(0,0,0,0.1)"/>
      <!-- Right edge shadow -->
      <path d="M ${368*s},${160*s} L ${372*s},${456*s} L ${410*s},${456*s} L ${402*s},${160*s} Z"
            fill="rgba(0,0,0,0.12)"/>

      <!-- Specular highlight (glossy sheen on left side) -->
      <path d="M ${98*s},${160*s} L ${132*s},${160*s} L ${124*s},${456*s} L ${90*s},${456*s} Z"
            fill="rgba(255,255,255,0.12)"/>
      <!-- Second highlight strip -->
      <path d="M ${140*s},${160*s} L ${168*s},${160*s} L ${160*s},${280*s} L ${132*s},${280*s} Z"
            fill="rgba(255,255,255,0.07)"/>

      <!-- Center crease -->
      <line x1="${250*s}" y1="${160*s}" x2="${250*s}" y2="${456*s}" stroke="rgba(0,0,0,0.06)" stroke-width="${1.5*s}"/>

      <!-- Tissue paper poking out top -->
      <path d="M ${115*s},${163*s} Q ${145*s},${138*s} ${175*s},${163*s} Q ${205*s},${138*s} ${235*s},${163*s} Q ${265*s},${138*s} ${295*s},${163*s} Q ${325*s},${138*s} ${355*s},${163*s} Q ${380*s},${142*s} ${395*s},${162*s}"
            fill="url(#tissue)" stroke="rgba(255,255,255,0.5)" stroke-width="${1*s}"/>
    </g>

    <!-- Label -->
    <text x="${w/2}" y="${h*0.93}" font-family="Arial,Helvetica,sans-serif" font-size="${14*s}" font-weight="600" fill="rgba(0,0,0,0.38)" text-anchor="middle" letter-spacing="${2*s}">${escXml(ctx.name.toUpperCase())} · RETAIL</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  const logo = await selectLogoForBg(logoBuffer, ctx.p);
  return compositeLogo(bg, logo, w, h, Math.round(w * 0.38), "center", 0, -Math.round(h * 0.02));
}

/* ═══════════════════════════════════════════════════════════════════════
   PITCH DECK COVER (1920 × 1080)
══════════════════════════════════════════════════════════════════════ */

export async function makePitchDeck(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#060606"/>
        <stop offset="100%" stop-color="${darkenHex(ctx.p, 0.2)}"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="${w}" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${ctx.p}"/>
        <stop offset="50%" stop-color="${ctx.s}"/>
        <stop offset="100%" stop-color="${ctx.a}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${dotGrid(w, h, "rgba(255,255,255,0.03)", 36)}
    <!-- Large circle backdrop -->
    <circle cx="${w*0.78}" cy="${h*0.5}" r="${h*0.72}" fill="${alphaHex(ctx.p, 0.05)}"/>
    <circle cx="${w*0.78}" cy="${h*0.5}" r="${h*0.48}" fill="${alphaHex(ctx.s, 0.04)}"/>
    <!-- Gradient accent bar at top -->
    <rect x="0" y="0" width="${w}" height="${h*0.007}" fill="url(#accent)"/>
    <!-- Year / series badge -->
    <rect x="${w*0.06}" y="${h*0.55}" width="${w*0.12}" height="${h*0.065}" rx="${h*0.032}" fill="${alphaHex(ctx.p, 0.18)}" stroke="${alphaHex(ctx.p, 0.4)}" stroke-width="1.5"/>
    <text x="${w*0.12}" y="${h*0.592}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.028}" fill="${ctx.p}" text-anchor="middle" letter-spacing="2">2025</text>
    <!-- Main headline -->
    <text x="${w*0.06}" y="${h*0.42}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.095}" font-weight="700" fill="white" letter-spacing="-1">${escXml(ctx.name)}</text>
    <!-- Bottom left details -->
    <text x="${w*0.06}" y="${h*0.92}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.022}" fill="rgba(255,255,255,0.2)" letter-spacing="1">INVESTOR PRESENTATION · CONFIDENTIAL</text>
    <!-- Bottom right page number -->
    <text x="${w*0.94}" y="${h*0.92}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.022}" fill="rgba(255,255,255,0.2)" text-anchor="end">01</text>
    <!-- Accent line -->
    <rect x="${w*0.06}" y="${h*0.73}" width="${w*0.22}" height="2" fill="url(#accent)"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, await selectLogoForBg(logoBuffer, "#060606"), w, h, Math.round(h * 0.2), "center", Math.round(w * 0.2), 0);
}

/* ═══════════════════════════════════════════════════════════════════════
   STICKER SHEET (1500 × 1500)
══════════════════════════════════════════════════════════════════════ */

export async function makeStickerSheet(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#f8f8f8"/>
    ${dotGrid(w, h, "rgba(0,0,0,0.04)", 30)}
    <!-- Sticker outlines (die-cut look) -->
    <!-- Big circle sticker top center -->
    <circle cx="${w/2}" cy="${h*0.27}" r="${w*0.2}" fill="${ctx.p}" stroke="white" stroke-width="${w*0.012}" stroke-dasharray="${w*0.025} ${w*0.01}"/>
    <!-- Rectangle sticker bottom-left -->
    <rect x="${w*0.08}" y="${h*0.54}" width="${w*0.35}" height="${h*0.22}" rx="${w*0.04}" fill="${ctx.s}" stroke="white" stroke-width="${w*0.01}" stroke-dasharray="${w*0.02} ${w*0.008}"/>
    <!-- Rounded sticker bottom-right -->
    <rect x="${w*0.56}" y="${h*0.54}" width="${w*0.35}" height="${h*0.22}" rx="${w*0.09}" fill="${ctx.a}" stroke="white" stroke-width="${w*0.01}" stroke-dasharray="${w*0.02} ${w*0.008}"/>
    <!-- Small square stickers -->
    <rect x="${w*0.1}" y="${h*0.1}" width="${w*0.16}" height="${w*0.16}" rx="${w*0.03}" fill="${ctx.p2}" stroke="white" stroke-width="${w*0.009}" stroke-dasharray="${w*0.015} ${w*0.007}"/>
    <rect x="${w*0.74}" y="${h*0.1}" width="${w*0.16}" height="${w*0.16}" rx="${w*0.03}" fill="${darkenHex(ctx.p, 0.6)}" stroke="white" stroke-width="${w*0.009}" stroke-dasharray="${w*0.015} ${w*0.007}"/>
    <!-- Labels -->
    <text x="${w/2}" y="${h*0.27 + w*0.065}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.042}" font-weight="700" fill="white" text-anchor="middle">${escXml(ctx.name)}</text>
    <text x="${w*0.255}" y="${h*0.665}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.035}" font-weight="700" fill="white" text-anchor="middle">${escXml(ctx.industry.slice(0,10))}</text>
    <text x="${w*0.735}" y="${h*0.665}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.035}" font-weight="700" fill="white" text-anchor="middle">✦</text>
    <text x="${w*0.18}" y="${h*0.185}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.028}" font-weight="700" fill="white" text-anchor="middle">✦</text>
    <text x="${w*0.82}" y="${h*0.185}" font-family="Arial,Helvetica,sans-serif" font-size="${w*0.028}" font-weight="700" fill="white" text-anchor="middle">★</text>
    <!-- Sheet border -->
    <rect x="${w*0.02}" y="${h*0.02}" width="${w*0.96}" height="${h*0.96}" rx="${w*0.02}" fill="none" stroke="#cccccc" stroke-width="1.5" stroke-dasharray="12 6"/>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, Math.round(w * 0.22), "center", 0, -Math.round(h * 0.22));
}

/* ═══════════════════════════════════════════════════════════════════════
   EMAIL NEWSLETTER (600 × 800)
══════════════════════════════════════════════════════════════════════ */

export async function makeNewsletter(
  logoBuffer: Buffer,
  w: number,
  h: number,
  ctx: BrandCtx
): Promise<Buffer> {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#f4f4f4"/>
    <!-- Email client frame -->
    <rect x="0" y="0" width="${w}" height="${h*0.06}" fill="#e8e8e8"/>
    <rect x="${w*0.04}" y="${h*0.015}" width="${w*0.35}" height="${h*0.03}" rx="4" fill="#d0d0d0"/>
    <!-- Email body -->
    <rect x="0" y="${h*0.06}" width="${w}" height="${h*0.94}" fill="#ffffff"/>
    <!-- Header -->
    <rect x="0" y="${h*0.06}" width="${w}" height="${h*0.2}" fill="${ctx.p}"/>
    ${dotGrid(w, h*0.2, "rgba(255,255,255,0.08)", 24)}
    <text x="${w/2}" y="${h*0.06 + h*0.115}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.055}" font-weight="700" fill="white" text-anchor="middle">${escXml(ctx.name)}</text>
    <!-- Content section -->
    <text x="${w*0.08}" y="${h*0.35}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.038}" font-weight="700" fill="#111111">Hello 👋</text>
    ${[0,1,2].map(i=>`<rect x="${w*0.08}" y="${h*(0.38+i*0.06)}" width="${i===2 ? w*0.45 : w*0.84}" height="${h*0.018}" rx="3" fill="#e5e5e5"/>`).join("")}
    <!-- Hero image placeholder -->
    <rect x="${w*0.08}" y="${h*0.52}" width="${w*0.84}" height="${h*0.2}" rx="8" fill="${alphaHex(ctx.p, 0.08)}" stroke="${alphaHex(ctx.p, 0.15)}" stroke-width="1"/>
    <!-- CTA -->
    <rect x="${w/2 - w*0.2}" y="${h*0.755}" width="${w*0.4}" height="${h*0.065}" rx="${h*0.032}" fill="${ctx.p}"/>
    <text x="${w/2}" y="${h*0.795}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.03}" font-weight="600" fill="white" text-anchor="middle">Read More →</text>
    <!-- Footer -->
    <rect x="0" y="${h*0.9}" width="${w}" height="${h*0.1}" fill="#f4f4f4"/>
    <text x="${w/2}" y="${h*0.955}" font-family="Arial,Helvetica,sans-serif" font-size="${h*0.022}" fill="#999999" text-anchor="middle">Unsubscribe · Privacy · ${escXml(ctx.name)}</text>
  </svg>`;
  const bg = await svgToBuffer(svg, w, h);
  return compositeLogo(bg, logoBuffer, w, h, Math.round(w * 0.24), "center", 0, -Math.round(h * 0.26));
}

/* ─── XML escape ──────────────────────────────────────────────────────── */
function escXml(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export { svgToBuffer, compositeLogo };
