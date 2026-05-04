/**
 * Extract dominant colors directly from logo pixel data using Sharp.
 * No AI, no guessing — real colors from the actual image.
 */

import sharp from "sharp";
import type { BrandColor } from "@/lib/types";

interface PixelColor {
  r: number; g: number; b: number;
  count: number;
  hex: string;
}

/* ── Quantise RGB to a coarser grid so similar shades merge ─────────── */
function quantise(v: number, step = 24): number {
  return Math.round(v / step) * step;
}

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(c => Math.min(255, c).toString(16).padStart(2, "0")).join("");
}

/* ── Lightness (0-100) ─────────────────────────────────────────────── */
function lightness(r: number, g: number, b: number): number {
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 2.55;
}

/* ── Saturation (0-100) ────────────────────────────────────────────── */
function saturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = lightness(r, g, b);
  const d = (max - min) / 255;
  return l > 50 ? d / (2 - (max + min) / 255) * 100 : d / ((max + min) / 255) * 100;
}

/* ── Hue (0-360) ───────────────────────────────────────────────────── */
function hue(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === r)      h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else                h = (r - g) / d + 4;
  return Math.round(h * 60 + (h < 0 ? 360 : 0));
}

/* ── Colour namer ──────────────────────────────────────────────────── */
function namePigment(r: number, g: number, b: number, index: number): string {
  const l = lightness(r, g, b);
  const s = saturation(r, g, b);
  const h = hue(r, g, b);

  if (s < 10) {
    if (l > 85) return ["Soft White", "Ivory", "Pale Grey"][index % 3];
    if (l > 60) return ["Light Grey", "Silver Mist", "Cloud"][index % 3];
    if (l > 35) return ["Medium Grey", "Steel", "Slate"][index % 3];
    if (l > 15) return ["Charcoal", "Graphite", "Dark Slate"][index % 3];
    return ["Near Black", "Onyx", "Deep Shadow"][index % 3];
  }

  const hNames: [number, number, string[]][] = [
    [  0,  20, ["Crimson", "Ruby Red", "Cardinal"]],
    [ 20,  40, ["Burnt Orange", "Rust", "Amber"]],
    [ 40,  65, ["Golden Yellow", "Saffron", "Sunburst"]],
    [ 65,  80, ["Lime", "Yellow-Green", "Chartreuse"]],
    [ 80, 160, ["Emerald", "Forest Green", "Sage"]],
    [160, 195, ["Teal", "Cyan Mint", "Aquamarine"]],
    [195, 240, ["Sky Blue", "Azure", "Cobalt"]],
    [240, 275, ["Indigo", "Deep Blue", "Sapphire"]],
    [275, 310, ["Violet", "Purple", "Amethyst"]],
    [310, 345, ["Magenta", "Hot Pink", "Fuchsia"]],
    [345, 360, ["Crimson", "Ruby Red", "Scarlet"]],
  ];

  const lPrefix = l > 75 ? "Light " : l < 35 ? "Deep " : "";
  for (const [lo, hi, names] of hNames) {
    if (h >= lo && h < hi) return lPrefix + names[index % names.length];
  }
  return `Colour ${index + 1}`;
}

function colourUsage(index: number, total: number): string {
  if (index === 0) return "Primary brand colour — use for CTAs, key elements & backgrounds";
  if (index === 1) return "Secondary colour — use for accents, highlights & supporting elements";
  if (index === 2) return "Accent colour — use for hover states, badges & decorative touches";
  if (total > 3 && index === total - 1) return "Background / neutral — use for surfaces and spacers";
  return "Supporting colour — use sparingly for variety and emphasis";
}

/* ── Main extractor ────────────────────────────────────────────────── */
export async function extractLogoColors(logoBuffer: Buffer): Promise<BrandColor[]> {
  // Downscale for speed; preserve transparency
  const { data, info } = await sharp(logoBuffer)
    .resize(120, 120, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map<string, PixelColor>();
  const channels = info.channels; // 4 (RGBA)

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 20) continue;

    // Quantise to merge similar neighbours
    const qr = quantise(r), qg = quantise(g), qb = quantise(b);
    const key = `${qr}|${qg}|${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      // Running average for smooth representative colour
      existing.count++;
      existing.r = Math.round(existing.r + (r - existing.r) / existing.count);
      existing.g = Math.round(existing.g + (g - existing.g) / existing.count);
      existing.b = Math.round(existing.b + (b - existing.b) / existing.count);
      existing.hex = toHex(existing.r, existing.g, existing.b);
    } else {
      buckets.set(key, { r, g, b, count: 1, hex: toHex(qr, qg, qb) });
    }
  }

  // Sort by frequency, then remove near-duplicates with delta-E–style filter
  const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);

  const distinct: PixelColor[] = [];
  const MIN_DIFF = 40; // minimum channel-distance to count as distinct

  for (const c of sorted) {
    if (distinct.length >= 7) break;
    const tooClose = distinct.some(d =>
      Math.abs(d.r - c.r) + Math.abs(d.g - c.g) + Math.abs(d.b - c.b) < MIN_DIFF
    );
    if (!tooClose) distinct.push(c);
  }

  // Need at least 1 colour
  if (distinct.length === 0 && sorted.length > 0) distinct.push(sorted[0]);

  // Map to BrandColor
  return distinct.map((c, i) => ({
    hex: c.hex,
    rgb: { r: c.r, g: c.g, b: c.b },
    name: namePigment(c.r, c.g, c.b, i),
    usage: colourUsage(i, distinct.length),
  }));
}

/* ── Merge pixel colors into brandData color slots ─────────────────── */
/* ── Colour distance (Manhattan on RGB, 0–765) ─────────────────────── */
function colorDist(a: BrandColor, b: BrandColor): number {
  return Math.abs(a.rgb.r - b.rgb.r) + Math.abs(a.rgb.g - b.rgb.g) + Math.abs(a.rgb.b - b.rgb.b);
}

export function mergeExtractedColors(
  extracted: BrandColor[],
  claudeData: { primaryColors: BrandColor[]; secondaryColors: BrandColor[]; accentColors: BrandColor[] }
): { primaryColors: BrandColor[]; secondaryColors: BrandColor[]; accentColors: BrandColor[] } {
  if (extracted.length === 0) return claudeData;

  const allClaude = [
    ...claudeData.primaryColors,
    ...claudeData.secondaryColors,
    ...claudeData.accentColors,
  ];

  // For each extracted pixel colour, find the closest Claude colour.
  // If they're within 80 Manhattan units, borrow Claude's name & usage description.
  // Otherwise keep our pixel-accurate name.
  function enrich(px: BrandColor): BrandColor {
    if (allClaude.length === 0) return px;
    const closest = allClaude.reduce((best, c) =>
      colorDist(px, c) < colorDist(px, best) ? c : best
    , allClaude[0]);
    if (colorDist(px, closest) < 80) {
      return { ...px, name: closest.name || px.name, usage: closest.usage || px.usage };
    }
    return px;
  }

  const primary   = extracted.slice(0, 2).map(enrich);
  const secondary = extracted.slice(2, 4).map(enrich);
  const accent    = extracted.slice(4).map(enrich);

  return {
    primaryColors:   primary.length   ? primary   : [extracted[0]],
    secondaryColors: secondary.length ? secondary : extracted.slice(1, 2),
    accentColors:    accent.length    ? accent    : extracted.slice(2, 3),
  };
}
