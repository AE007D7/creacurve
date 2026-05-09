/**
 * Generates 2D brand-board and 3D card mockups for a logo using Sharp.
 */

import sharp from "sharp";

/* ── helpers ─────────────────────────────────────────────────────────────── */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

/** Solid-color PNG buffer (RGBA) */
async function solidPng(w: number, h: number, r: number, g: number, b: number, a = 255): Promise<Buffer> {
  const data = Buffer.alloc(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a;
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

/** Diagonal gradient PNG (top-left → bottom-right) */
async function gradientPng(w: number, h: number, from: [number,number,number], to: [number,number,number]): Promise<Buffer> {
  const data = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (x / w * 0.6 + y / h * 0.4);
      const i = (y * w + x) * 3;
      data[i]   = Math.round(from[0] + (to[0] - from[0]) * t);
      data[i+1] = Math.round(from[1] + (to[1] - from[1]) * t);
      data[i+2] = Math.round(from[2] + (to[2] - from[2]) * t);
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
}

/** Fit logo into a box, return buffer resized to fit */
async function fitLogo(logoBuf: Buffer, maxW: number, maxH: number): Promise<Buffer> {
  return sharp(logoBuf).resize(maxW, maxH, { fit: "inside", withoutEnlargement: false }).png().toBuffer();
}

/** White version of logo (all non-transparent pixels → white) */
async function whiteVersion(logoBuf: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(logoBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    out[i] = 255; out[i+1] = 255; out[i+2] = 255; out[i+3] = data[i+3];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/* ── 2D Brand Board ──────────────────────────────────────────────────────── */
// 1400 × 760px  |  left half = white bg, right half = dark bg

export async function buildBrandBoard(logoBuf: Buffer, accentHex: string): Promise<Buffer> {
  const W = 1400, H = 760;
  const HALF = W / 2;
  const { r: ar, g: ag, b: ab } = hexToRgb(accentHex);

  // Backgrounds
  const whiteBg = await solidPng(HALF, H, 255, 255, 255);
  const darkBg  = await solidPng(HALF, H, 14, 14, 24);

  // Accent strip top (full width, 6px)
  const accentStrip = await solidPng(W, 6, ar, ag, ab);

  // Logo fits
  const logoOnWhite = await fitLogo(logoBuf, HALF - 120, H - 200);
  const logoWhite   = await whiteVersion(logoBuf);
  const logoOnDark  = await fitLogo(logoWhite, HALF - 120, H - 200);

  // Divider line between halves
  const divider = await solidPng(2, H, ar, ag, ab);

  // Measure fitted logos to center them
  const lwMeta = await sharp(logoOnWhite).metadata();
  const ldMeta = await sharp(logoOnDark).metadata();
  const lw = lwMeta.width!, lh = lwMeta.height!;
  const dw = ldMeta.width!, dh = ldMeta.height!;

  const leftLogoX  = Math.round((HALF - lw) / 2);
  const leftLogoY  = Math.round((H - 80 - lh) / 2);
  const rightLogoX = HALF + Math.round((HALF - dw) / 2);
  const rightLogoY = Math.round((H - 80 - dh) / 2);

  // Bottom label strip
  const labelH = 56;
  const labelStrip = await solidPng(W, labelH, 248, 248, 252);

  return sharp({ create: { width: W, height: H, channels: 3, background: { r: 255, g: 255, b: 255 } } })
    .png()
    .toBuffer()
    .then(base =>
      sharp(base)
        .composite([
          // Halves
          { input: whiteBg, left: 0,    top: 0 },
          { input: darkBg,  left: HALF, top: 0 },
          // Logos
          { input: logoOnWhite, left: leftLogoX,  top: leftLogoY  },
          { input: logoOnDark,  left: rightLogoX, top: rightLogoY },
          // Divider
          { input: divider, left: HALF - 1, top: 0 },
          { input: accentStrip, left: 0, top: 0 },
          { input: labelStrip,  left: 0, top: H - labelH },
        ])
        .png()
        .toBuffer()
    );
}

/* ── 3D Card Mockup ──────────────────────────────────────────────────────── */
// 1400 × 900px  |  logo on a tilted card with drop shadow

export async function buildCardMockup3D(logoBuf: Buffer, accentHex: string): Promise<Buffer> {
  const W = 1400, H = 900;
  const { r: ar, g: ag, b: ab } = hexToRgb(accentHex);

  // ── Background: soft gradient ──
  const bgBuf = await gradientPng(W, H, [232, 232, 242], [248, 248, 255]);

  // ── Build the card face (560 × 350) ──
  const CARD_W = 560, CARD_H = 350;

  // Card: white with thin accent top bar
  const cardBase = await solidPng(CARD_W, CARD_H, 255, 255, 255);
  const cardBar  = await solidPng(CARD_W, 8, ar, ag, ab);

  // Logo fitted inside card with generous padding
  const logoFit = await fitLogo(logoBuf, CARD_W - 100, CARD_H - 120);
  const lfMeta  = await sharp(logoFit).metadata();
  const logoX   = Math.round((CARD_W - lfMeta.width!)  / 2);
  const logoY   = Math.round((CARD_H - lfMeta.height!) / 2) + 4;

  const cardFace = await sharp(cardBase)
    .composite([
      { input: logoFit, left: logoX, top: logoY },
      { input: cardBar, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  // ── Apply affine shear to simulate 3D tilt ──
  // Matrix [a, b, c, d]: transforms (x,y) → (ax+by, cx+dy)
  // Shear + slight vertical compress for a right-facing card illusion
  const tiltedCard = await sharp(cardFace)
    .affine([1, 0, -0.28, 0.82], {
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      interpolator: sharp.interpolators.bicubic,
    })
    .png()
    .toBuffer();

  // ── Shadow: blurred dark version of tilted card ──
  // Fill the tilted card with semi-transparent black, then blur it
  const tiltedMeta = await sharp(tiltedCard).metadata();
  const tw = tiltedMeta.width!, th = tiltedMeta.height!;

  const { data: tData, info: tInfo } = await sharp(tiltedCard)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Fill non-transparent pixels with dark color for shadow
  const shadowData = Buffer.alloc(tData.length);
  for (let i = 0; i < tData.length; i += 4) {
    const a = tData[i + 3];
    shadowData[i] = 10; shadowData[i+1] = 10; shadowData[i+2] = 20;
    shadowData[i+3] = Math.round(a * 0.35);
  }

  const shadowRaw = await sharp(shadowData, { raw: { width: tInfo.width, height: tInfo.height, channels: 4 } })
    .blur(28)
    .png()
    .toBuffer();

  // ── Composite: bg → shadow (offset) → tilted card ──
  const cardX   = Math.round((W - tw) / 2);
  const cardY   = Math.round((H - th) / 2);
  const shadowX = cardX + 22;
  const shadowY = cardY + 28;

  return sharp(bgBuf)
    .composite([
      { input: shadowRaw,  left: Math.max(0, shadowX), top: Math.max(0, shadowY) },
      { input: tiltedCard, left: Math.max(0, cardX),   top: Math.max(0, cardY)   },
    ])
    .png()
    .toBuffer();
}

/* ── Favicon set from transparent logo ───────────────────────────────────── */
// Returns 3 PNG buffers at 16, 32, 192px (square, trim-cropped)

export async function buildFaviconSet(logoBuf: Buffer): Promise<{ s16: Buffer; s32: Buffer; s192: Buffer }> {
  // Trim transparent edges and crop to square
  const trimmed = await sharp(logoBuf).trim({ background: "transparent" }).toBuffer();
  const meta    = await sharp(trimmed).metadata();
  const side    = Math.max(meta.width!, meta.height!);

  // Extend to square with transparent padding so it's symmetrical
  const squared = await sharp(trimmed)
    .extend({
      top:    Math.round((side - meta.height!) / 2),
      bottom: Math.ceil( (side - meta.height!) / 2),
      left:   Math.round((side - meta.width!)  / 2),
      right:  Math.ceil( (side - meta.width!)  / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const [s16, s32, s192] = await Promise.all([
    sharp(squared).resize(16,  16,  { fit: "fill" }).png().toBuffer(),
    sharp(squared).resize(32,  32,  { fit: "fill" }).png().toBuffer(),
    sharp(squared).resize(192, 192, { fit: "fill" }).png().toBuffer(),
  ]);

  return { s16, s32, s192 };
}
