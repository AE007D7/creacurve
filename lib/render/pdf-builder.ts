/**
 * Professional 10-page brand guidelines PDF generator.
 * Landscape A4 (841.89 × 595.28pt), style-adaptive, real brand colors.
 */

import PDFDocument from "pdfkit";
import sharp from "sharp";
import type { BrandData, BrandColor } from "@/lib/types";

export interface BrandGuidelinesContent {
  brandName: string;
  brandData: BrandData;
  logoUrl?: string;
}

/* ════════════════════════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════════════════════════ */

const PW = 841.89;   // landscape A4 width (pts)
const PH = 595.28;   // landscape A4 height (pts)
const MG = 48;       // margin
const CW = PW - MG * 2;  // content width
const CH = PH - MG * 2;  // content height

/* ════════════════════════════════════════════════════════════════════════
   COLOUR HELPERS
════════════════════════════════════════════════════════════════════════ */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToCmyk(r: number, g: number, b: number) {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const k = 1 - Math.max(r1, g1, b1);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const d = 1 - k;
  return {
    c: Math.round(((1 - r1 - k) / d) * 100),
    m: Math.round(((1 - g1 - k) / d) * 100),
    y: Math.round(((1 - b1 - k) / d) * 100),
    k: Math.round(k * 100),
  };
}

function isLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function darken(hex: string, amt = 0.5): string {
  const { r, g, b } = hexToRgb(hex);
  return `#${[r, g, b].map(c => Math.round(c * amt).toString(16).padStart(2, "0")).join("")}`;
}

function alpha(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex.replace("#", "").length === 3
    ? hex.replace(/(.)/g, "$1$1").slice(1)
    : hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* ════════════════════════════════════════════════════════════════════════
   STYLE / THEME SYSTEM
════════════════════════════════════════════════════════════════════════ */

interface Theme {
  pageBg: string;
  coverBg: string;
  coverText: string;
  text: string;
  textSub: string;
  textMuted: string;
  accent: string;          // primary brand colour
  accent2: string;         // secondary brand colour
  accentAlt: string;       // accent brand colour
  divider: string;
  cardBg: string;
  cardBorder: string;
  labelBg: string;
  labelText: string;
  headerBg: string;
  headerText: string;
  footerText: string;
  fontH: string;
  fontB: string;
  fontM: string;
  sectionStyle: "bar" | "pill" | "underline";
}

function buildTheme(bd: BrandData): Theme {
  const p  = bd.primaryColors[0]?.hex   || "#7c3aed";
  const s  = bd.secondaryColors[0]?.hex || "#06b6d4";
  const a  = bd.accentColors[0]?.hex    || "#fb7185";
  const style = bd.style || "minimal";

  const base = {
    accent: p, accent2: s, accentAlt: a,
    divider: "#e8e8e8",
    fontH: "Helvetica-Bold",
    fontB: "Helvetica",
    fontM: "Courier",
    sectionStyle: "bar" as "bar" | "pill" | "underline",
  };

  if (style === "tech") {
    return {
      ...base,
      pageBg: "#0d0d0f", coverBg: "#080810", coverText: "#ffffff",
      text: "#f0f0f0", textSub: "#a0a0b0", textMuted: "#606070",
      cardBg: "#161620", cardBorder: alpha(p, 0.25),
      labelBg: alpha(p, 0.15), labelText: p,
      headerBg: "#0d0d0f", headerText: "#f0f0f0",
      footerText: "#404050", divider: "#202030",
      fontM: "Courier", sectionStyle: "pill",
    };
  }
  if (style === "luxury") {
    return {
      ...base,
      pageBg: "#f9f5ee", coverBg: "#1a1410", coverText: "#f9f5ee",
      text: "#1a1410", textSub: "#4a3f30", textMuted: "#8a7f70",
      cardBg: "#ffffff", cardBorder: "#e8dfc8",
      labelBg: "#f0e8d0", labelText: "#4a3f30",
      headerBg: "#f9f5ee", headerText: "#1a1410",
      footerText: "#a09080", divider: "#e0d8c8",
      fontH: "Times-Bold", fontB: "Times-Roman",
      sectionStyle: "underline",
    };
  }
  if (style === "playful") {
    return {
      ...base,
      pageBg: "#ffffff", coverBg: p, coverText: isLight(p) ? "#111111" : "#ffffff",
      text: "#111111", textSub: "#444444", textMuted: "#888888",
      cardBg: "#fafafa", cardBorder: alpha(p, 0.2),
      labelBg: alpha(p, 0.1), labelText: p,
      headerBg: "#ffffff", headerText: "#111111",
      footerText: "#aaaaaa", divider: "#eeeeee",
      sectionStyle: "pill",
    };
  }
  if (style === "bold") {
    return {
      ...base,
      pageBg: "#ffffff", coverBg: "#111111", coverText: "#ffffff",
      text: "#111111", textSub: "#333333", textMuted: "#777777",
      cardBg: "#f5f5f5", cardBorder: "#dddddd",
      labelBg: "#111111", labelText: "#ffffff",
      headerBg: "#111111", headerText: "#ffffff",
      footerText: "#999999", divider: "#dddddd",
      sectionStyle: "bar",
    };
  }
  if (style === "organic") {
    return {
      ...base,
      pageBg: "#f5f0e8", coverBg: "#3d3428", coverText: "#f5f0e8",
      text: "#2d2820", textSub: "#5d5040", textMuted: "#9d9080",
      cardBg: "#faf7f0", cardBorder: "#e0d8c0",
      labelBg: "#ede4cc", labelText: "#3d3428",
      headerBg: "#f5f0e8", headerText: "#2d2820",
      footerText: "#b0a890", divider: "#ddd8c0",
      fontH: "Times-Bold", fontB: "Times-Roman",
      sectionStyle: "underline",
    };
  }
  if (style === "vintage") {
    return {
      ...base,
      pageBg: "#f8f6f2", coverBg: "#1a2540", coverText: "#f8f6f2",
      text: "#1a2540", textSub: "#2d3f60", textMuted: "#8090a8",
      cardBg: "#ffffff", cardBorder: "#d8dce8",
      labelBg: alpha(p, 0.1), labelText: p,
      headerBg: "#1a2540", headerText: "#f8f6f2",
      footerText: "#9090a0", divider: "#d8dce8",
      sectionStyle: "bar",
    };
  }

  // default: minimal
  return {
    ...base,
    pageBg: "#ffffff", coverBg: "#ffffff", coverText: "#111111",
    text: "#111111", textSub: "#333333", textMuted: "#888888",
    cardBg: "#f8f8f8", cardBorder: "#e8e8e8",
    labelBg: "#f0f0f0", labelText: "#333333",
    headerBg: "#ffffff", headerText: "#111111",
    footerText: "#bbbbbb", divider: "#ebebeb",
    sectionStyle: "underline",
  };
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE CHROME
════════════════════════════════════════════════════════════════════════ */

function pageBackground(doc: PDFKit.PDFDocument, t: Theme) {
  doc.rect(0, 0, PW, PH).fill(t.pageBg);
}

function pageHeader(doc: PDFKit.PDFDocument, section: string, brandName: string, t: Theme) {
  // Thin top bar
  doc.rect(0, 0, PW, 3).fill(t.accent);

  // Section label
  doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
    .text(section.toUpperCase(), MG, 12, { characterSpacing: 1.5 });

  // Brand name right
  doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
    .text(brandName.toUpperCase(), 0, 12, { align: "right", width: PW - MG, characterSpacing: 1 });
}

function pageFooter(doc: PDFKit.PDFDocument, pageNum: number, t: Theme) {
  const y = PH - 22;
  doc.rect(0, y - 4, PW, 1).fill(t.divider);
  doc.font(t.fontB).fontSize(8).fillColor(t.footerText)
    .text(String(pageNum), 0, y, { align: "center", width: PW });
}

function sectionLabel(doc: PDFKit.PDFDocument, text: string, x: number, y: number, t: Theme, w = 180) {
  if (t.sectionStyle === "pill") {
    doc.roundedRect(x, y, w, 22, 11).fill(t.labelBg);
    doc.font(t.fontB).fontSize(9).fillColor(t.labelText)
      .text(text.toUpperCase(), x + 12, y + 7, { characterSpacing: 1 });
  } else if (t.sectionStyle === "underline") {
    doc.font(t.fontH).fontSize(11).fillColor(t.text).text(text.toUpperCase(), x, y, { characterSpacing: 1.5 });
    doc.rect(x, y + 14, w * 0.4, 1.5).fill(t.accent);
  } else {
    // bar
    doc.rect(x, y, 3, 20).fill(t.accent);
    doc.font(t.fontB).fontSize(9).fillColor(t.textMuted)
      .text(text.toUpperCase(), x + 10, y + 6, { characterSpacing: 1 });
  }
}

function dividerLine(doc: PDFKit.PDFDocument, y: number, t: Theme, x1 = MG, x2 = PW - MG) {
  doc.moveTo(x1, y).lineTo(x2, y).stroke(t.divider);
}

/* ════════════════════════════════════════════════════════════════════════
   LOGO EMBED HELPER
════════════════════════════════════════════════════════════════════════ */

async function fetchLogoBuf(url?: string): Promise<Buffer | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const raw = Buffer.from(await res.arrayBuffer());
    // Resize to max 400×400 to keep PDF file size small
    return await sharp(raw)
      .resize(400, 400, { fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 7 })
      .toBuffer();
  } catch {
    return null;
  }
}

function placeLogo(
  doc: PDFKit.PDFDocument,
  logoBuf: Buffer | null,
  cx: number, cy: number,
  maxW: number, maxH: number,
  t: Theme
) {
  if (logoBuf) {
    try {
      doc.image(logoBuf, cx - maxW / 2, cy - maxH / 2, { fit: [maxW, maxH], align: "center", valign: "center" });
      return;
    } catch { /* fall through */ }
  }
  // Fallback placeholder
  const pw = maxW * 0.6, ph = maxH * 0.5;
  doc.roundedRect(cx - pw / 2, cy - ph / 2, pw, ph, 8).fill(t.cardBg);
  doc.font(t.fontB).fontSize(10).fillColor(t.textMuted)
    .text("LOGO", cx - pw / 2, cy - 6, { align: "center", width: pw });
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 1 — COVER
════════════════════════════════════════════════════════════════════════ */

function page01Cover(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  logoBuf: Buffer | null,
  t: Theme
) {
  const p = t.accent, s = t.accent2;

  // Full background
  doc.rect(0, 0, PW, PH).fill(t.coverBg);

  // Right panel — brand colour block
  const panelW = PW * 0.42;
  doc.rect(PW - panelW, 0, panelW, PH).fill(p);

  // Dot grid on right panel
  for (let x = PW - panelW + 24; x < PW - 20; x += 28)
    for (let y = 24; y < PH - 20; y += 28)
      doc.circle(x, y, 1.2).fill(alpha(t.coverText === "#ffffff" ? "#ffffff" : "#000000", 0.1));

  // Diagonal accent strip
  doc.save();
  doc.moveTo(PW - panelW - 40, 0).lineTo(PW - panelW + 40, 0).lineTo(PW - panelW + 40, PH).lineTo(PW - panelW - 40, PH).clip();
  doc.rect(PW - panelW - 40, 0, 80, PH).fill(s);
  doc.restore();

  // Secondary accent circle on right panel
  doc.circle(PW - panelW / 2, PH * 0.75, 80).fill(alpha(t.coverBg === "#ffffff" ? "#ffffff" : "#000000", 0.1));

  // Left panel content
  const textColor = t.coverText === "#ffffff" ? "#ffffff" : t.text;
  const textMuted = t.coverText === "#ffffff" ? "rgba(255,255,255,0.5)" : t.textMuted;

  // Version chip
  doc.roundedRect(MG, MG + 4, 80, 18, 9).fill(alpha(t.coverText === "#ffffff" ? "#ffffff" : "#000000", 0.1));
  doc.font(t.fontB).fontSize(8).fillColor(alpha(t.coverText === "#ffffff" ? "#ffffff" : "#000000", 0.6))
    .text("VERSION 1.0", MG + 8, MG + 9, { characterSpacing: 1 });

  // Brand name
  doc.font(t.fontH).fontSize(52).fillColor(textColor)
    .text(brandName.toUpperCase(), MG, PH * 0.32, { lineGap: 4 });

  // Rule line
  doc.rect(MG, PH * 0.32 + 70, 60, 2).fill(t.accentAlt || s);

  // Sub
  doc.font(t.fontB).fontSize(13).fillColor(textMuted)
    .text("BRAND GUIDELINES", MG, PH * 0.32 + 84, { characterSpacing: 2 });

  // Date bottom left
  doc.font(t.fontB).fontSize(9).fillColor(textMuted)
    .text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }), MG, PH - MG - 16);

  // Logo on right panel
  placeLogo(doc, logoBuf, PW - panelW / 2, PH * 0.42, panelW * 0.65, PH * 0.45, t);

  // CreaCurve watermark bottom right
  doc.font(t.fontB).fontSize(8)
    .fillColor(isLight(p) ? alpha("#000000", 0.3) : alpha("#ffffff", 0.3))
    .text("Generated by CreaCurve.com", PW - panelW + 16, PH - MG - 16, { width: panelW - 32 });
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 2 — CONTENTS
════════════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { n: "01", title: "Introduction",           sub: "About the brand & at a glance" },
  { n: "02", title: "The Logo",               sub: "Primary lockup & usage" },
  { n: "03", title: "Construction & Grid",    sub: "Structure, proportions & geometry" },
  { n: "04", title: "Clear Space & Sizes",    sub: "Exclusion zones & minimum dimensions" },
  { n: "05", title: "Colour Palette",         sub: "Primary, secondary & accent colours" },
  { n: "06", title: "Typography",             sub: "Typefaces, weights & pairings" },
  { n: "07", title: "Logo on Backgrounds",    sub: "Approved & approved-with-care uses" },
  { n: "08", title: "Brand Voice",            sub: "Tone, personality & voice examples" },
  { n: "09", title: "Brand Applications",     sub: "Sample uses across touchpoints" },
  { n: "10", title: "Misuse",                 sub: "What never to do" },
];

function page02Contents(doc: PDFKit.PDFDocument, t: Theme) {
  pageBackground(doc, t);
  pageHeader(doc, "Contents", "Index", t);

  // Title
  doc.font(t.fontH).fontSize(32).fillColor(t.text)
    .text("Contents", MG, MG + 30);
  doc.rect(MG, MG + 72, 40, 2).fill(t.accent);

  const rowH = 38;
  const startY = MG + 88;
  const col2X = MG + 320;

  SECTIONS.forEach((s, i) => {
    const y = startY + i * rowH;

    if (i % 2 === 0) {
      doc.rect(MG - 8, y - 5, CW + 16, rowH - 2).fill(t.cardBg);
    }

    // Number
    doc.font(t.fontH).fontSize(11).fillColor(t.accent)
      .text(s.n, MG, y + 9);

    // Title
    doc.font(t.fontH).fontSize(13).fillColor(t.text)
      .text(s.title, MG + 32, y + 7);

    // Sub
    doc.font(t.fontB).fontSize(9).fillColor(t.textMuted)
      .text(s.sub, col2X, y + 10, { width: CW - (col2X - MG) - 40 });

    // Dots
    const dotStart = MG + 32 + doc.fontSize(13).widthOfString(s.title) + 8;
    const dotEnd = col2X - 12;
    let dx = dotStart;
    while (dx < dotEnd) {
      doc.circle(dx, y + 14, 0.8).fill(t.divider);
      dx += 6;
    }

    // Page number
    doc.font(t.fontB).fontSize(10).fillColor(t.accent)
      .text(String(i + 3), PW - MG - 24, y + 8);
  });

  pageFooter(doc, 2, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 3 — INTRODUCTION
════════════════════════════════════════════════════════════════════════ */

function page03Introduction(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "01  Introduction", brandName, t);
  sectionLabel(doc, "Introduction", MG, MG + 26, t);

  const col1W = CW * 0.56;
  const col2X = MG + col1W + 32;
  const col2W = CW - col1W - 32;
  const contentY = MG + 66;

  // Left column — About
  doc.font(t.fontH).fontSize(22).fillColor(t.text)
    .text(`About ${brandName}`, MG, contentY);

  dividerLine(doc, contentY + 32, t, MG, MG + col1W);

  const aboutText = [
    `${brandName} is a ${bd.style} brand operating in the ${bd.industry} space.`,
    `This document establishes the visual identity standards that define how the brand`,
    `presents itself across all platforms and touchpoints.`,
    ``,
    `Every element within these guidelines has been carefully considered to reflect the`,
    `brand's core values: ${bd.personality?.slice(0, 4).join(", ")}.`,
    ``,
    `These standards are designed to ensure consistency, professionalism, and immediate`,
    `recognition wherever the brand appears — from business cards to billboards.`,
  ].join("\n");

  doc.font(t.fontB).fontSize(10).fillColor(t.textSub).lineGap(3)
    .text(aboutText, MG, contentY + 42, { width: col1W, lineGap: 2 });

  // Design principles
  const dpY = contentY + 185;
  doc.font(t.fontH).fontSize(11).fillColor(t.text).text("Design Principles", MG, dpY);
  bd.designPrinciples?.slice(0, 4).forEach((dp, i) => {
    doc.rect(MG, dpY + 20 + i * 26, 3, 16).fill(t.accentAlt || t.accent2);
    doc.font(t.fontB).fontSize(9).fillColor(t.textSub)
      .text(dp, MG + 10, dpY + 23 + i * 26, { width: col1W - 14 });
  });

  // Right column — "At a Glance" card
  doc.roundedRect(col2X, contentY - 4, col2W, CH - 42, 12).fill(t.cardBg);
  doc.roundedRect(col2X, contentY - 4, col2W, 44, 12).fill(t.accent);
  // Repair bottom corners of accent block
  doc.rect(col2X, contentY + 18, col2W, 22).fill(t.accent);

  doc.font(t.fontH).fontSize(12).fillColor(isLight(t.accent) ? "#111111" : "#ffffff")
    .text("AT A GLANCE", col2X + 16, contentY + 10, { characterSpacing: 2 });

  const facts = [
    ["Industry",     bd.industry || "—"],
    ["Style",        (bd.style || "—").charAt(0).toUpperCase() + (bd.style || "").slice(1)],
    ["Personality",  bd.personality?.slice(0, 3).join(", ") || "—"],
    ["Colours",      `${(bd.primaryColors?.length || 0) + (bd.secondaryColors?.length || 0) + (bd.accentColors?.length || 0)} total`],
    ["Typefaces",    bd.fontPairings?.length ? `${bd.fontPairings[0].heading} / ${bd.fontPairings[0].body}` : "—"],
    ["Target",       bd.targetAudience ? bd.targetAudience.slice(0, 38) : "—"],
  ];

  facts.forEach(([label, value], i) => {
    const fy = contentY + 56 + i * 40;
    if (i % 2 === 0 && i > 0) {
      doc.rect(col2X, fy - 4, col2W, 40).fill(t.pageBg === "#ffffff" ? "#f5f5f5" : darken(t.cardBg, 0.97));
    }
    doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
      .text(label.toUpperCase(), col2X + 16, fy + 1, { characterSpacing: 0.8 });
    doc.font(t.fontH).fontSize(10).fillColor(t.text)
      .text(value, col2X + 16, fy + 14, { width: col2W - 32 });
  });

  pageFooter(doc, 3, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 4 — THE LOGO
════════════════════════════════════════════════════════════════════════ */

function page04TheLogo(
  doc: PDFKit.PDFDocument,
  brandName: string,
  logoBuf: Buffer | null,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "02  The Logo", brandName, t);
  sectionLabel(doc, "Primary Lockup", MG, MG + 26, t);

  const logoAreaX = MG + 20;
  const logoAreaY = MG + 70;
  const logoAreaW = PW * 0.56 - MG;
  const logoAreaH = CH - 84;

  // Logo display panel
  doc.roundedRect(logoAreaX, logoAreaY, logoAreaW, logoAreaH, 10).fill(t.cardBg);

  // Corner marks (grid registration)
  const cm = 12;
  const corners = [
    [logoAreaX + 16, logoAreaY + 16],
    [logoAreaX + logoAreaW - 16, logoAreaY + 16],
    [logoAreaX + 16, logoAreaY + logoAreaH - 16],
    [logoAreaX + logoAreaW - 16, logoAreaY + logoAreaH - 16],
  ] as [number, number][];

  corners.forEach(([cx, cy]) => {
    doc.moveTo(cx - cm / 2, cy).lineTo(cx + cm / 2, cy).stroke(t.divider);
    doc.moveTo(cx, cy - cm / 2).lineTo(cx, cy + cm / 2).stroke(t.divider);
  });

  // Place logo centered
  placeLogo(doc, logoBuf, logoAreaX + logoAreaW / 2, logoAreaY + logoAreaH / 2, logoAreaW * 0.65, logoAreaH * 0.65, t);

  // Right side annotations
  const annoX = logoAreaX + logoAreaW + 28;
  const annoW = PW - annoX - MG;

  doc.font(t.fontH).fontSize(20).fillColor(t.text).text(brandName, annoX, logoAreaY + 6);
  doc.rect(annoX, logoAreaY + 34, 36, 2).fill(t.accent);

  doc.font(t.fontB).fontSize(10).fillColor(t.textMuted).lineGap(2)
    .text("Primary Brand Mark", annoX, logoAreaY + 44);

  const specs = [
    ["Format",   "PNG · SVG · PDF"],
    ["Version",  "v1.0"],
    ["Lockup",   "Combination Mark"],
    ["Colours",  "Multi-colour"],
  ];

  specs.forEach(([k, v], i) => {
    const sy = logoAreaY + 80 + i * 36;
    doc.rect(annoX, sy, annoW, 30).fill(t.cardBg);
    doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
      .text(k.toUpperCase(), annoX + 10, sy + 5, { characterSpacing: 0.8 });
    doc.font(t.fontH).fontSize(10).fillColor(t.text)
      .text(v, annoX + 10, sy + 16);
  });

  // Usage note
  const noteY = logoAreaY + logoAreaH - 80;
  doc.roundedRect(annoX, noteY, annoW, 70, 8).fill(t.labelBg);
  doc.rect(annoX, noteY, 3, 70).fill(t.accent2);
  doc.font(t.fontH).fontSize(9).fillColor(t.text).text("USAGE NOTE", annoX + 12, noteY + 8);
  doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
    .text("Always use the provided master files. Never recreate the logo from scratch or attempt to redraw it.", annoX + 12, noteY + 24, { width: annoW - 22, lineGap: 2 });

  pageFooter(doc, 4, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 5 — CONSTRUCTION
════════════════════════════════════════════════════════════════════════ */

function page05Construction(
  doc: PDFKit.PDFDocument,
  brandName: string,
  logoBuf: Buffer | null,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "03  Construction & Grid", brandName, t);
  sectionLabel(doc, "Grid System", MG, MG + 26, t);

  const panelX = MG + 10;
  const panelY = MG + 70;
  const panelW = PW * 0.55 - MG;
  const panelH = CH - 80;
  const unit = Math.min(panelW, panelH) / 8;

  // Grid panel
  doc.roundedRect(panelX, panelY, panelW, panelH, 8).fill(t.cardBg);

  // Grid lines
  for (let i = 0; i <= 8; i++) {
    const gx = panelX + (i / 8) * panelW;
    const gy = panelY + (i / 8) * panelH;
    doc.moveTo(gx, panelY).lineTo(gx, panelY + panelH).stroke(alpha(t.divider, 0.8));
    doc.moveTo(panelX, gy).lineTo(panelX + panelW, gy).stroke(alpha(t.divider, 0.8));
  }

  // Center cross
  doc.moveTo(panelX + panelW / 2, panelY).lineTo(panelX + panelW / 2, panelY + panelH)
    .dash(4, { space: 4 }).stroke(alpha(t.accent, 0.3)).undash();
  doc.moveTo(panelX, panelY + panelH / 2).lineTo(panelX + panelW, panelY + panelH / 2)
    .dash(4, { space: 4 }).stroke(alpha(t.accent, 0.3)).undash();

  // Dimension annotations — top
  const aTop = panelY - 18;
  doc.moveTo(panelX, aTop).lineTo(panelX + panelW, aTop).stroke(t.textMuted);
  doc.moveTo(panelX, aTop - 4).lineTo(panelX, aTop + 4).stroke(t.textMuted);
  doc.moveTo(panelX + panelW, aTop - 4).lineTo(panelX + panelW, aTop + 4).stroke(t.textMuted);
  doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
    .text("8 units", panelX + panelW / 2 - 20, aTop - 12);

  // Side annotation
  const aLeft = panelX - 20;
  doc.moveTo(aLeft, panelY).lineTo(aLeft, panelY + panelH).stroke(t.textMuted);
  doc.moveTo(aLeft - 4, panelY).lineTo(aLeft + 4, panelY).stroke(t.textMuted);
  doc.moveTo(aLeft - 4, panelY + panelH).lineTo(aLeft + 4, panelY + panelH).stroke(t.textMuted);

  // Logo on grid
  placeLogo(doc, logoBuf, panelX + panelW / 2, panelY + panelH / 2, panelW * 0.55, panelH * 0.55, t);

  // Unit label
  doc.roundedRect(panelX + 8, panelY + panelH - 30, 60, 20, 4).fill(t.accent);
  doc.font(t.fontB).fontSize(8).fillColor(isLight(t.accent) ? "#000000" : "#ffffff")
    .text("1 UNIT = X", panelX + 12, panelY + panelH - 22);

  // Right — component breakdown
  const compX = panelX + panelW + 30;
  const compW = PW - compX - MG + 6;

  doc.font(t.fontH).fontSize(16).fillColor(t.text).text("Components", compX, panelY);
  dividerLine(doc, panelY + 24, t, compX, compX + compW);

  const components = [
    { name: "Icon / Symbol",    desc: "The primary pictorial element. Can stand alone at small sizes." },
    { name: "Wordmark",         desc: "The brand name set in the primary typeface." },
    { name: "Lockup Spacing",   desc: "Defined relationship between icon and wordmark." },
    { name: "Baseline",         desc: "The visual foundation aligning all elements." },
  ];

  components.forEach((c, i) => {
    const cy = panelY + 36 + i * 68;
    doc.roundedRect(compX, cy, compW, 58, 6).fill(t.cardBg);
    doc.rect(compX, cy, 3, 58).fill(i % 2 === 0 ? t.accent : t.accent2);

    // Component sample (small unit box)
    doc.roundedRect(compX + 10, cy + 10, 36, 36, 4).fill(t.labelBg);
    doc.font(t.fontH).fontSize(16).fillColor(t.accent)
      .text(String(i + 1), compX + 10, cy + 15, { align: "center", width: 36 });

    doc.font(t.fontH).fontSize(10).fillColor(t.text).text(c.name, compX + 54, cy + 9);
    doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
      .text(c.desc, compX + 54, cy + 24, { width: compW - 62, lineGap: 1.5 });
  });

  pageFooter(doc, 5, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 6 — CLEAR SPACE & MINIMUM SIZE
════════════════════════════════════════════════════════════════════════ */

function page06ClearSpace(
  doc: PDFKit.PDFDocument,
  brandName: string,
  logoBuf: Buffer | null,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "04  Clear Space & Minimum Sizes", brandName, t);
  sectionLabel(doc, "Exclusion Zone", MG, MG + 26, t);

  // Clear space diagram
  const dX = MG + 40, dY = MG + 68;
  const dW = 260, dH = 170;
  const gap = 30;

  // Outer zone (grey)
  doc.roundedRect(dX - gap, dY - gap, dW + gap * 2, dH + gap * 2, 6)
    .dash(5, { space: 4 }).stroke(t.accent).undash();

  // "X" dimension arrows
  // Top
  const aColor = t.accent;
  const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
    doc.moveTo(x1, y1).lineTo(x2, y2).stroke(aColor);
    doc.moveTo(x1 - 4, y1 - 4).lineTo(x1, y1).lineTo(x1 + 4, y1 - 4).stroke(aColor);
    doc.moveTo(x2 - 4, y2 + 4).lineTo(x2, y2).lineTo(x2 + 4, y2 + 4).stroke(aColor);
  };

  // Top dimension
  const midX = dX + dW / 2;
  doc.moveTo(midX - 20, dY - gap).lineTo(midX - 20, dY).stroke(aColor);
  doc.font(t.fontB).fontSize(8).fillColor(t.accent).text("X", midX - 24, dY - gap / 2 - 4);

  // Left dimension
  const midY = dY + dH / 2;
  doc.moveTo(dX - gap, midY).lineTo(dX, midY).stroke(aColor);
  doc.font(t.fontB).fontSize(8).fillColor(t.accent).text("X", dX - gap + 4, midY - 10);

  void drawArrow;

  // Logo panel inside
  doc.roundedRect(dX, dY, dW, dH, 4).fill(t.cardBg);
  placeLogo(doc, logoBuf, dX + dW / 2, dY + dH / 2, dW * 0.65, dH * 0.65, t);

  // X label
  doc.font(t.fontB).fontSize(9).fillColor(t.textMuted)
    .text("X = height of the logo mark", dX - gap, dY + dH + gap + 8, { width: dW + gap * 2 });

  // Minimum sizes table
  const tableX = dX + dW + gap + 60;
  const tableY = dY;
  const tableW = PW - tableX - MG - 10;

  doc.font(t.fontH).fontSize(14).fillColor(t.text).text("Minimum Sizes", tableX, tableY - 10);
  dividerLine(doc, tableY + 12, t, tableX, tableX + tableW);

  const sizes = [
    { medium: "Digital",     unit: "px",  v: "32px", desc: "Icon only — app icons, favicons" },
    { medium: "Digital",     unit: "px",  v: "80px", desc: "Full lockup — web, social media" },
    { medium: "Print",       unit: "mm",  v: "8mm",  desc: "Icon only — business card, stamp" },
    { medium: "Print",       unit: "mm",  v: "20mm", desc: "Full lockup — letterhead, brochure" },
    { medium: "Large Format",unit: "mm",  v: "50mm", desc: "Full lockup — banner, signage" },
  ];

  sizes.forEach((row, i) => {
    const ry = tableY + 22 + i * 34;
    doc.rect(tableX, ry, tableW, 28).fill(i % 2 === 0 ? t.cardBg : t.pageBg);

    doc.roundedRect(tableX + 6, ry + 5, 48, 18, 4).fill(t.labelBg);
    doc.font(t.fontB).fontSize(8).fillColor(t.labelText)
      .text(row.medium, tableX + 6, ry + 10, { align: "center", width: 48, characterSpacing: 0.5 });

    doc.font(t.fontH).fontSize(14).fillColor(t.accent)
      .text(row.v, tableX + 62, ry + 5, { width: 48 });

    doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
      .text(row.desc, tableX + 118, ry + 9, { width: tableW - 126 });
  });

  // DO / DON'T note
  const noteY = tableY + 215;
  doc.roundedRect(tableX, noteY, tableW, 50, 6).fill(t.labelBg);
  doc.font(t.fontH).fontSize(9).fillColor(t.text).text("✓  DO", tableX + 12, noteY + 8);
  doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
    .text("Always maintain clear space equal to X on all four sides of the logo.", tableX + 12, noteY + 22, { width: tableW - 24 });

  pageFooter(doc, 6, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 7 — COLOUR PALETTE
════════════════════════════════════════════════════════════════════════ */

function page07Colours(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "05  Colour Palette", brandName, t);
  sectionLabel(doc, "Brand Colours", MG, MG + 26, t);

  function drawSwatch(color: BrandColor, x: number, y: number, w: number, h: number, label: string) {
    const { r, g, b } = hexToRgb(color.hex);
    const cmyk = rgbToCmyk(r, g, b);
    const textOnSwatch = isLight(color.hex) ? "#111111" : "#ffffff";

    // Main swatch block
    doc.roundedRect(x, y, w, h, 8).fill(color.hex);

    // Label chip top-left
    doc.roundedRect(x + 8, y + 8, label.length * 6 + 12, 16, 8)
      .fill(isLight(color.hex) ? alpha("#000000", 0.15) : alpha("#ffffff", 0.18));
    doc.font(t.fontB).fontSize(7).fillColor(textOnSwatch)
      .text(label, x + 14, y + 12, { characterSpacing: 0.8 });

    // Colour name
    doc.font(t.fontH).fontSize(11).fillColor(textOnSwatch)
      .text(color.name, x + 10, y + h - 52, { width: w - 20 });

    // HEX chip
    doc.roundedRect(x + 10, y + h - 34, w - 20, 22, 4)
      .fill(isLight(color.hex) ? alpha("#000000", 0.12) : alpha("#ffffff", 0.15));
    doc.font(t.fontM).fontSize(9).fillColor(textOnSwatch)
      .text(color.hex.toUpperCase(), x + 10, y + h - 27, { align: "center", width: w - 20 });

    // Below swatch — values
    const vy = y + h + 8;
    doc.font(t.fontB).fontSize(7.5).fillColor(t.textMuted)
      .text(`RGB  ${r} / ${g} / ${b}`, x, vy);
    doc.font(t.fontB).fontSize(7.5).fillColor(t.textMuted)
      .text(`CMYK  ${cmyk.c} / ${cmyk.m} / ${cmyk.y} / ${cmyk.k}`, x, vy + 12);
    doc.font(t.fontB).fontSize(7.5).fillColor(t.textMuted)
      .text(color.usage || "", x, vy + 24, { width: w });
  }

  // Collect all colours — max 8
  const all = [
    ...bd.primaryColors.map(c => ({ c, lbl: "PRIMARY" })),
    ...bd.secondaryColors.map(c => ({ c, lbl: "SECONDARY" })),
    ...bd.accentColors.map(c => ({ c, lbl: "ACCENT" })),
  ].slice(0, 8);

  const count = all.length;
  const swatchW = Math.min(110, (CW - (count - 1) * 14) / count);
  const swatchH = 140;
  const startX = MG + Math.max(0, (CW - (count * swatchW + (count - 1) * 14)) / 2);
  const startY = MG + 68;

  all.forEach(({ c, lbl }, i) => {
    drawSwatch(c, startX + i * (swatchW + 14), startY, swatchW, swatchH, lbl);
  });

  // Colour relationships note
  const noteY = startY + swatchH + 60;
  dividerLine(doc, noteY, t);
  doc.font(t.fontH).fontSize(11).fillColor(t.text).text("Colour Relationships", MG, noteY + 10);

  const relationships = [
    `Primary ${bd.primaryColors[0]?.name || ""}`,
    `pairs with`,
    `Secondary ${bd.secondaryColors[0]?.name || ""}`,
  ];

  doc.font(t.fontB).fontSize(9).fillColor(t.textSub)
    .text(relationships.join("  ·  "), MG, noteY + 28, { width: CW * 0.6 });

  // Contrast accessibility note
  doc.roundedRect(PW - MG - 260, noteY + 6, 252, 56, 8).fill(t.cardBg);
  doc.font(t.fontH).fontSize(9).fillColor(t.text).text("Accessibility", PW - MG - 244, noteY + 14);
  doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
    .text("Always check colour contrast ratios against WCAG 2.1 AA before applying colours to text. Minimum ratio: 4.5:1 for normal text.", PW - MG - 244, noteY + 28, { width: 228, lineGap: 1.5 });

  pageFooter(doc, 7, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 8 — TYPOGRAPHY
════════════════════════════════════════════════════════════════════════ */

function page08Typography(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "06  Typography", brandName, t);
  sectionLabel(doc, "Typefaces", MG, MG + 26, t);

  const font = bd.fontPairings?.[0];
  const headingFont = font?.heading || "Helvetica";
  const bodyFont = font?.body || "Helvetica";

  // Left column — Heading typeface
  const col1W = (CW - 32) / 2;
  const col2X = MG + col1W + 32;

  // Heading specimen
  doc.roundedRect(MG, MG + 66, col1W, CH - 72, 8).fill(t.cardBg);
  doc.rect(MG, MG + 66, col1W, 3).fill(t.accent);

  doc.font(t.fontH).fontSize(9).fillColor(t.textMuted)
    .text("HEADING TYPEFACE", MG + 16, MG + 78, { characterSpacing: 1 });
  doc.font(t.fontH).fontSize(18).fillColor(t.accent)
    .text(headingFont, MG + 16, MG + 96);

  // Big specimen
  doc.font(t.fontH).fontSize(72).fillColor(t.text)
    .text("Aa", MG + 16, MG + 124);

  // Alphabet
  doc.font(t.fontH).fontSize(10).fillColor(t.textSub)
    .text("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", MG + 16, MG + 212, { width: col1W - 32, lineGap: 3 });
  doc.font(t.fontH).fontSize(10).fillColor(t.textSub)
    .text("a b c d e f g h i j k l m n o p q r s t u v w x y z", MG + 16, MG + 232, { width: col1W - 32, lineGap: 3 });
  doc.font(t.fontH).fontSize(10).fillColor(t.textSub)
    .text("0 1 2 3 4 5 6 7 8 9  !  @  #  &  ( )  +  —", MG + 16, MG + 252, { width: col1W - 32 });

  dividerLine(doc, MG + 278, t, MG + 16, MG + col1W - 16);

  // Weight stack
  const weights = [
    { label: "Display", size: 22, font: t.fontH },
    { label: "Heading", size: 16, font: t.fontH },
    { label: "Body",    size: 12, font: t.fontB },
    { label: "Caption", size: 9,  font: t.fontB },
  ];
  weights.forEach((w, i) => {
    const wy = MG + 292 + i * 38;
    doc.font(t.fontB).fontSize(7).fillColor(t.textMuted)
      .text(w.label.toUpperCase(), MG + 16, wy, { characterSpacing: 0.8 });
    doc.font(w.font).fontSize(w.size).fillColor(t.text)
      .text(brandName, MG + 16, wy + 10, { width: col1W - 32 });
  });

  // Right column — Body typeface + usage table
  doc.roundedRect(col2X, MG + 66, col1W, CH - 72, 8).fill(t.cardBg);
  doc.rect(col2X, MG + 66, col1W, 3).fill(t.accent2);

  doc.font(t.fontH).fontSize(9).fillColor(t.textMuted)
    .text("BODY TYPEFACE", col2X + 16, MG + 78, { characterSpacing: 1 });
  doc.font(t.fontH).fontSize(18).fillColor(t.accent2)
    .text(bodyFont, col2X + 16, MG + 96);

  // Body specimen paragraph
  doc.font(t.fontB).fontSize(10).fillColor(t.textSub).lineGap(3)
    .text(
      `The quick brown fox jumps over the lazy dog. ${brandName} builds brands that last — bold, consistent, and unmistakable. Great design communicates before words do.`,
      col2X + 16, MG + 124, { width: col1W - 32, lineGap: 3 }
    );

  dividerLine(doc, MG + 198, t, col2X + 16, col2X + col1W - 16);

  // Usage guidelines
  const usages = [
    { style: "Display / Hero",   size: "48–72pt",  usage: "Hero headlines, cover pages" },
    { style: "H1 Heading",       size: "32–42pt",  usage: "Section titles, page headers" },
    { style: "H2 Subheading",    size: "22–28pt",  usage: "Subsections, card titles" },
    { style: "Body Text",        size: "10–12pt",  usage: "Paragraphs, descriptions" },
    { style: "Caption / Label",  size: "8–9pt",    usage: "Captions, metadata, badges" },
  ];

  doc.font(t.fontH).fontSize(9).fillColor(t.text)
    .text("TYPE SCALE", col2X + 16, MG + 210, { characterSpacing: 1 });

  usages.forEach((u, i) => {
    const uy = MG + 228 + i * 36;
    doc.rect(col2X + 16, uy, col1W - 32, 30).fill(i % 2 === 0 ? t.pageBg : t.cardBg);
    doc.font(t.fontH).fontSize(9).fillColor(t.text).text(u.style, col2X + 22, uy + 5);
    doc.font(t.fontM).fontSize(8).fillColor(t.accent).text(u.size, col2X + 22, uy + 18);
    doc.font(t.fontB).fontSize(8).fillColor(t.textMuted)
      .text(u.usage, col2X + 120, uy + 10, { width: col1W - 150 });
  });

  // Mood tag bottom
  if (font?.mood) {
    doc.roundedRect(col2X + 16, MG + CH - 44, col1W - 32, 22, 8).fill(t.labelBg);
    doc.font(t.fontB).fontSize(8).fillColor(t.labelText)
      .text(`Mood: ${font.mood}`, col2X + 24, MG + CH - 36, { width: col1W - 48 });
  }

  pageFooter(doc, 8, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 9 — LOGO ON BACKGROUNDS
════════════════════════════════════════════════════════════════════════ */

function page09Backgrounds(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  logoBuf: Buffer | null,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "07  Logo on Backgrounds", brandName, t);
  sectionLabel(doc, "Background Usage", MG, MG + 26, t);

  const cellW = (CW - 24) / 4;
  const cellH = CH - 80;
  const cellY = MG + 66;

  const panels = [
    { bg: "#ffffff",        label: "White",      status: "APPROVED",  note: "Primary use case" },
    { bg: "#f5f5f0",        label: "Off-White",  status: "APPROVED",  note: "Print substrates" },
    { bg: "#0a0a0a",        label: "Black",      status: "APPROVED",  note: "Invert to white logo" },
    { bg: bd.primaryColors[0]?.hex || t.accent, label: "Brand Colour", status: "USE CARE", note: "Check contrast" },
  ];

  panels.forEach((panel, i) => {
    const cx = MG + i * (cellW + 8);
    const light = isLight(panel.bg);
    const statusColor = panel.status === "APPROVED" ? "#22c55e" : "#f59e0b";

    // Panel
    doc.roundedRect(cx, cellY, cellW, cellH - 48, 8).fill(panel.bg);

    // Logo
    placeLogo(doc, logoBuf, cx + cellW / 2, cellY + (cellH - 48) / 2 - 18, cellW * 0.65, (cellH - 48) * 0.5, t);

    // Subtle border
    doc.roundedRect(cx, cellY, cellW, cellH - 48, 8)
      .stroke(panel.bg === "#ffffff" ? "#e8e8e8" : panel.bg);

    // Status badge
    doc.roundedRect(cx + cellW / 2 - 44, cellY + cellH - 52 + 4, 88, 18, 9).fill(statusColor);
    doc.font(t.fontH).fontSize(8)
      .fillColor("#ffffff")
      .text(panel.status, cx + cellW / 2 - 44, cellY + cellH - 52 + 10,
        { align: "center", width: 88, characterSpacing: 0.5 });

    // Label
    doc.font(t.fontH).fontSize(9).fillColor(t.text)
      .text(panel.label, cx, cellY + cellH - 26, { align: "center", width: cellW });

    // Note
    doc.font(t.fontB).fontSize(7.5).fillColor(t.textMuted)
      .text(panel.note, cx, cellY + cellH - 13, { align: "center", width: cellW });

    void light;
  });

  pageFooter(doc, 9, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 10 — BRAND VOICE
════════════════════════════════════════════════════════════════════════ */

function page10BrandVoice(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "08  Brand Voice", brandName, t);
  sectionLabel(doc, "Tone & Language", MG, MG + 26, t);

  const colW = (CW - 24) / 2;

  // Left — Tone + Personality
  doc.font(t.fontH).fontSize(16).fillColor(t.text).text("Tone of Voice", MG, MG + 68);
  dividerLine(doc, MG + 92, t, MG, MG + colW);
  doc.font(t.fontB).fontSize(10).fillColor(t.textSub).lineGap(3)
    .text(bd.brandVoice?.tone || "", MG, MG + 100, { width: colW, lineGap: 3 });

  // Personality traits as pills
  const traitsY = MG + 165;
  doc.font(t.fontH).fontSize(11).fillColor(t.text).text("Personality", MG, traitsY);
  let pillX = MG;
  const pillY = traitsY + 22;
  bd.personality?.forEach((trait) => {
    const pillW = doc.fontSize(9).widthOfString(trait) + 22;
    doc.roundedRect(pillX, pillY, pillW, 22, 11).fill(t.labelBg);
    doc.font(t.fontH).fontSize(9).fillColor(t.labelText)
      .text(trait.charAt(0).toUpperCase() + trait.slice(1), pillX + 11, pillY + 7);
    pillX += pillW + 8;
    if (pillX > MG + colW - 60) { pillX = MG; }
  });

  // Vocabulary
  const vocabY = traitsY + 75;
  doc.font(t.fontH).fontSize(11).fillColor(t.text).text("Brand Vocabulary", MG, vocabY);
  const vocab = bd.brandVoice?.vocabulary?.slice(0, 8) || [];
  vocab.forEach((word, i) => {
    doc.rect(MG, vocabY + 22 + i * 22, 3, 14).fill(t.accent2);
    doc.font(t.fontB).fontSize(9).fillColor(t.textSub)
      .text(word, MG + 10, vocabY + 24 + i * 22);
  });

  // Right — Voice Examples
  const rx = MG + colW + 24;
  doc.font(t.fontH).fontSize(16).fillColor(t.text).text("Copy Examples", rx, MG + 68);
  dividerLine(doc, MG + 92, t, rx, rx + colW);

  const exY = MG + 100;
  if (bd.brandVoice?.examples?.length) {
    bd.brandVoice.examples.slice(0, 4).forEach((ex, i) => {
      doc.roundedRect(rx, exY + i * 56, colW, 48, 6).fill(t.cardBg);
      doc.font(t.fontH === "Times-Bold" ? "Times-Italic" : "Helvetica-Oblique")
        .fontSize(10).fillColor(t.textSub)
        .text(ex, rx + 12, exY + 14 + i * 56, { width: colW - 24 });
    });
  }

  pageFooter(doc, 10, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 11 — BRAND APPLICATIONS (overview of assets)
════════════════════════════════════════════════════════════════════════ */

function page11Applications(
  doc: PDFKit.PDFDocument,
  brandName: string,
  bd: BrandData,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "09  Brand Applications", brandName, t);
  sectionLabel(doc, "Touchpoints", MG, MG + 26, t);

  const items = [
    { icon: "✦", label: "Logo Variations",  desc: "Original · White · Black · Monochrome · Favicon" },
    { icon: "📄", label: "Stationery",       desc: "Business card · Letterhead · Email signature · Invoice" },
    { icon: "📱", label: "Social Media",     desc: "Instagram · LinkedIn · Twitter/X · YouTube · Story" },
    { icon: "👕", label: "Merchandise",      desc: "T-shirt · Mug · Tote bag · Sticker sheet" },
    { icon: "🏪", label: "Signage",          desc: "Storefront · Billboard · Roll-up banner" },
    { icon: "💻", label: "Web & Digital",    desc: "Website hero · App screen · Newsletter" },
    { icon: "📦", label: "Packaging",        desc: "Product box · Shopping bag" },
    { icon: "🎤", label: "Presentations",    desc: "Pitch deck cover slide" },
  ];

  const cols = 2;
  const cardW = (CW - 16) / cols;
  const cardH = 60;

  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = MG + col * (cardW + 16);
    const cy = MG + 72 + row * (cardH + 10);

    doc.roundedRect(cx, cy, cardW, cardH, 8).fill(t.cardBg);
    doc.rect(cx, cy, 3, cardH).fill(t.accent);

    // Icon bg
    doc.roundedRect(cx + 12, cy + 12, 36, 36, 8).fill(t.labelBg);
    doc.font(t.fontB).fontSize(18).fillColor(t.accent)
      .text(item.icon, cx + 12, cy + 20, { align: "center", width: 36 });

    doc.font(t.fontH).fontSize(11).fillColor(t.text)
      .text(item.label, cx + 56, cy + 12, { width: cardW - 68 });
    doc.font(t.fontB).fontSize(8).fillColor(t.textSub)
      .text(item.desc, cx + 56, cy + 29, { width: cardW - 68, lineGap: 1 });
  });

  // Total asset count
  doc.roundedRect(MG, PH - MG - 50, CW, 38, 10).fill(t.accent);
  doc.font(t.fontH).fontSize(14)
    .fillColor(isLight(t.accent) ? "#111111" : "#ffffff")
    .text("60+ professional brand assets, generated in 90 seconds by CreaCurve", MG + 20, PH - MG - 36, { width: CW - 40 });

  pageFooter(doc, 11, t);
}

/* ════════════════════════════════════════════════════════════════════════
   PAGE 12 — MISUSE
════════════════════════════════════════════════════════════════════════ */

function page12Misuse(
  doc: PDFKit.PDFDocument,
  brandName: string,
  logoBuf: Buffer | null,
  t: Theme
) {
  pageBackground(doc, t);
  pageHeader(doc, "10  Misuse", brandName, t);
  sectionLabel(doc, "Logo Don'ts", MG, MG + 26, t);

  const COLS = 3, ROWS = 2;
  const cardW = (CW - (COLS - 1) * 14) / COLS;
  const cardH = (CH - 80 - (ROWS - 1) * 12) / ROWS;
  const startY = MG + 68;

  const rules = [
    { title: "Don't stretch",      desc: "Never distort proportions.", transform: "scale(1.4,0.7)" },
    { title: "Don't rotate",       desc: "Never tilt or rotate the logo.", transform: "rotate(35deg)" },
    { title: "Don't recolour",     desc: "Never apply unapproved colours.", tint: true },
    { title: "Don't add effects",  desc: "No shadows, glows, or outlines.", shadow: true },
    { title: "Don't use on busy backgrounds", desc: "Always maintain legibility.", busy: true },
    { title: "Don't use low-res",  desc: "Always use master vector files.", blur: true },
  ];

  rules.forEach((rule, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = MG + col * (cardW + 14);
    const cy = startY + row * (cardH + 12);

    // Card
    doc.roundedRect(cx, cy, cardW, cardH, 8).fill(t.cardBg);
    doc.roundedRect(cx, cy, cardW, cardH, 8).stroke(alpha("#ef4444", 0.3));

    // Red top bar
    doc.rect(cx, cy, cardW, 3).fill("#ef4444");

    // Logo area (misused)
    const logoAreaH = cardH - 44;
    doc.roundedRect(cx + 8, cy + 10, cardW - 16, logoAreaH, 4).fill(t.pageBg);

    // For simplicity, place the normal logo (in reality it would be transformed)
    if (rule.busy) {
      // Busy background
      for (let bx = cx + 8; bx < cx + cardW - 16; bx += 12)
        for (let by2 = cy + 10; by2 < cy + 10 + logoAreaH; by2 += 12)
          doc.rect(bx, by2, 10, 10).fill(
            (Math.floor(bx / 12) + Math.floor(by2 / 12)) % 2 === 0 ? t.accent : t.accent2
          );
    }

    placeLogo(
      doc, logoBuf,
      cx + cardW / 2, cy + 10 + logoAreaH / 2,
      (cardW - 24) * 0.6, logoAreaH * 0.6,
      t
    );

    // Red X overlay
    const xCx = cx + cardW - 22, xCy = cy + 16;
    doc.circle(xCx, xCy, 10).fill("#ef4444");
    doc.font(t.fontH).fontSize(12).fillColor("#ffffff")
      .text("✕", xCx - 10, xCy - 8, { align: "center", width: 20 });

    // Caption
    doc.font(t.fontH).fontSize(8.5).fillColor(t.text)
      .text(rule.title, cx + 8, cy + cardH - 28, { width: cardW - 16 });
    doc.font(t.fontB).fontSize(7.5).fillColor(t.textMuted)
      .text(rule.desc, cx + 8, cy + cardH - 16, { width: cardW - 16 });

    void rule.transform; void rule.tint; void rule.shadow; void rule.blur;
  });

  pageFooter(doc, 12, t);
}

/* ════════════════════════════════════════════════════════════════════════
   BACK COVER  (page 13)
════════════════════════════════════════════════════════════════════════ */

function pageBackCover(doc: PDFKit.PDFDocument, brandName: string, t: Theme) {
  doc.rect(0, 0, PW, PH).fill(t.accent);

  // Dot grid
  for (let x = 24; x < PW - 20; x += 28)
    for (let y = 24; y < PH - 20; y += 28)
      doc.circle(x, y, 1.4).fill(alpha(isLight(t.accent) ? "#000000" : "#ffffff", 0.08));

  // Circle decoration
  doc.circle(PW * 0.8, PH * 0.2, 180).fill(alpha(isLight(t.accent) ? "#000000" : "#ffffff", 0.06));
  doc.circle(PW * 0.2, PH * 0.85, 130).fill(alpha(t.accent2, 0.25));

  const tc = isLight(t.accent) ? "#111111" : "#ffffff";
  const tm = isLight(t.accent) ? alpha("#000000", 0.45) : alpha("#ffffff", 0.5);

  doc.font(t.fontH).fontSize(36).fillColor(tc)
    .text(brandName.toUpperCase(), MG, PH * 0.38, { align: "center", width: CW, characterSpacing: 3 });

  doc.rect(PW / 2 - 40, PH * 0.38 + 52, 80, 2).fill(t.accentAlt || t.accent2);

  doc.font(t.fontB).fontSize(12).fillColor(tm)
    .text("Brand Identity Guidelines", MG, PH * 0.38 + 64, { align: "center", width: CW });

  doc.font(t.fontB).fontSize(10).fillColor(tm)
    .text("Generated by CreaCurve — creacurve.com", MG, PH - MG - 24, { align: "center", width: CW });
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════════════════════════ */

export async function buildBrandGuidelinesPDF(
  content: BrandGuidelinesContent
): Promise<Buffer> {
  const { brandName, brandData: bd, logoUrl } = content;

  const logoBuf = await fetchLogoBuf(logoUrl);
  const theme   = buildTheme(bd);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size:   [PW, PH],
      layout: "landscape",
      margin: 0,
      info: {
        Title:   `${brandName} — Brand Guidelines`,
        Author:  "CreaCurve",
        Subject: "Brand Identity Manual",
        Keywords: "brand guidelines, logo manual, identity",
      },
    });

    doc.on("data",  (c: Buffer) => chunks.push(c));
    doc.on("end",   () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // P1 — Cover
    page01Cover(doc, brandName, bd, logoBuf, theme);

    // P2 — Contents
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page02Contents(doc, theme);

    // P3 — Introduction
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page03Introduction(doc, brandName, bd, theme);

    // P4 — The Logo
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page04TheLogo(doc, brandName, logoBuf, theme);

    // P5 — Construction
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page05Construction(doc, brandName, logoBuf, theme);

    // P6 — Clear Space
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page06ClearSpace(doc, brandName, logoBuf, theme);

    // P7 — Colour Palette
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page07Colours(doc, brandName, bd, theme);

    // P8 — Typography
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page08Typography(doc, brandName, bd, theme);

    // P9 — Logo on Backgrounds
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page09Backgrounds(doc, brandName, bd, logoBuf, theme);

    // P10 — Brand Voice
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page10BrandVoice(doc, brandName, bd, theme);

    // P11 — Applications
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page11Applications(doc, brandName, bd, theme);

    // P12 — Misuse
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    page12Misuse(doc, brandName, logoBuf, theme);

    // Back cover
    doc.addPage({ size: [PW, PH], layout: "landscape", margin: 0 });
    pageBackCover(doc, brandName, theme);

    doc.end();
  });
}
