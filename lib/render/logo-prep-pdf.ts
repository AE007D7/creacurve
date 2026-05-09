/**
 * Brand guidelines PDF for the logo-prep tool.
 * US Letter portrait — 8.5 × 11 inches (612 × 792pt at 72dpi).
 *
 * Redesigned for a professional, polished look with:
 *  - Dark cover with full-bleed accent bands
 *  - Left sidebar accent strip on interior pages
 *  - Richer color swatches, two-column typography, styled dos/don'ts
 */

import PDFDocument from "pdfkit";
import type { BrandColor } from "@/lib/types";

// ── Page dimensions ────────────────────────────────────────────────────────────
const PW = 612;   // 8.5 in × 72
const PH = 792;   // 11 in × 72
const MG = 48;
const CW = PW - MG * 2;

// ── Colour helpers ─────────────────────────────────────────────────────────────
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

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

/** Left sidebar accent strip (call at start of each interior page) */
function sidebar(doc: PDFKit.PDFDocument, accent: string) {
  const { r, g, b } = hexToRgb(accent);
  doc.rect(0, 0, 6, PH).fill([r, g, b]);
}

/** Title block just below top of interior page */
function titleBlock(
  doc:       PDFKit.PDFDocument,
  section:   string,
  title:     string,
  accent:    string,
) {
  const { r, g, b } = hexToRgb(accent);
  // Light gray band
  doc.rect(6, 0, PW - 6, 60).fill("#f5f5f5");
  // Section label
  doc.font("Helvetica-Bold").fontSize(11).fillColor([r, g, b])
    .text(section.toUpperCase(), 60, 20, { characterSpacing: 2 });
  // Page title
  doc.font("Helvetica-Bold").fontSize(22).fillColor("#1a1a1a")
    .text(title, 60, 35);
}

/** Thin section divider with label */
function sectionDivider(
  doc:    PDFKit.PDFDocument,
  label:  string,
  y:      number,
  accent: string,
): number {
  const { r, g, b } = hexToRgb(accent);
  doc.rect(MG, y, CW, 1).fill([r, g, b]);
  doc.font("Helvetica-Bold").fontSize(8).fillColor([r, g, b])
    .text(label.toUpperCase(), MG, y + 5, { characterSpacing: 1.5 });
  return y + 22;
}

function footer(doc: PDFKit.PDFDocument, pageNum: number, brandName: string) {
  doc.font("Helvetica").fontSize(7).fillColor("#bbbbbb")
    .text(`${brandName} Brand Guidelines`, MG, PH - 28, { width: CW / 2 })
    .text(`${pageNum}`, MG + CW / 2, PH - 28, { width: CW / 2, align: "right" });
}

// ── Page 1 — Cover ─────────────────────────────────────────────────────────────
function pageCover(
  doc:       PDFKit.PDFDocument,
  brandName: string,
  logoBuf:   Buffer | null,
  accent:    string,
) {
  const { r, g, b } = hexToRgb(accent);

  // Full-page dark background
  doc.rect(0, 0, PW, PH).fill("#0d0d0d");

  // Top accent band
  doc.rect(0, 0, PW, 90).fill([r, g, b]);

  // Bottom accent band
  doc.rect(0, PH - 70, PW, 70).fill([r, g, b]);

  // Logo centered in upper third
  if (logoBuf) {
    try {
      const logoSize = 160;
      doc.image(logoBuf, (PW - logoSize) / 2, 140, {
        fit:   [logoSize, logoSize],
        align: "center",
      });
    } catch { /* skip */ }
  }

  // Brand name
  doc.font("Helvetica-Bold").fontSize(38).fillColor("#ffffff")
    .text(brandName, MG, 340, { align: "center", width: CW });

  // Thin horizontal rule
  doc.rect(PW / 2 - 40, 390, 80, 2).fill([r, g, b]);

  // Sub-heading
  doc.font("Helvetica").fontSize(11).fillColor("#ffffff")
    .text("BRAND IDENTITY GUIDELINES", MG, 402, {
      align: "center",
      width: CW,
      characterSpacing: 2,
    });

  // creacurve.com
  doc.font("Helvetica").fontSize(8).fillColor([r, g, b])
    .text("creacurve.com", MG, PH - 100, { align: "center", width: CW });

  // Year
  doc.font("Helvetica").fontSize(8).fillColor("#888888")
    .text("© 2025", MG, PH - 85, { align: "center", width: CW });
}

// ── Page 2 — The Logo ──────────────────────────────────────────────────────────
function pageLogo(
  doc:       PDFKit.PDFDocument,
  brandName: string,
  logoBuf:   Buffer | null,
  accent:    string,
) {
  sidebar(doc, accent);
  titleBlock(doc, "02 — Brand Mark", "The Logo", accent);

  const { r: ar, g: ag, b: ab } = hexToRgb(accent);
  let y = 80;

  // Three logo display boxes
  const boxW = 160;
  const boxH = 120;
  const totalBoxW = boxW * 3 + 20 * 2;
  const boxStartX = MG + Math.round((CW - totalBoxW) / 2);

  const boxes = [
    { label: "On White",  bg: "#ffffff", border: "#e0e0e0", darkBg: false },
    { label: "On Dark",   bg: "#1a1a1a", border: null,      darkBg: true  },
    { label: "On Brand",  bg: accent,    border: null,      darkBg: !isLight(accent) },
  ];

  boxes.forEach((box, i) => {
    const bx = boxStartX + i * (boxW + 20);
    const { r: br, g: bg, b: bb } = hexToRgb(box.bg);

    // Box background
    doc.rect(bx, y, boxW, boxH).fill([br, bg, bb]);

    // Border for white box
    if (box.border) {
      doc.rect(bx, y, boxW, boxH).stroke(box.border);
    }

    // Logo inside box
    if (logoBuf) {
      try {
        const pad = 16;
        doc.image(logoBuf, bx + pad, y + pad, {
          fit:   [boxW - pad * 2, boxH - pad * 2],
          align: "center",
        });
      } catch { /* skip */ }
    }

    // Label below
    const labelColor = "#888888";
    doc.font("Helvetica").fontSize(8).fillColor(labelColor)
      .text(box.label, bx, y + boxH + 6, { width: boxW, align: "center" });
  });

  y += boxH + 30;

  // About the Logo section
  y = sectionDivider(doc, "About The Logo", y, accent);
  doc.font("Helvetica").fontSize(10).fillColor("#444444")
    .text(
      `The ${brandName} logo is the primary visual asset of the brand. Always use the approved logo files and never alter its proportions, colors, or spacing. The logo should breathe — give it room to make an impact.`,
      MG, y, { width: CW, lineGap: 4 },
    );
  y += 52;

  // Clear Space Rule
  y = sectionDivider(doc, "Clear Space Rule", y, accent);
  doc.font("Helvetica").fontSize(10).fillColor("#444444")
    .text(
      "Always maintain a minimum clear space around the logo equal to the cap height of the wordmark. No other graphic elements, text, or imagery should appear within this protected zone.",
      MG, y, { width: CW, lineGap: 4 },
    );
  y += 52;

  // Visual clear space diagram
  const diagramCX = PW / 2;
  const dLogoW = 120;
  const dLogoH = 60;
  const dLogoX = diagramCX - dLogoW / 2;
  const dLogoY = y + 20;
  const space  = 24; // clear space size

  // Outer dashed zone
  doc.rect(dLogoX - space, dLogoY - space, dLogoW + space * 2, dLogoH + space * 2)
    .dash(4, { space: 3 }).stroke([ar, ag, ab]);
  doc.undash();

  // Logo box
  doc.rect(dLogoX, dLogoY, dLogoW, dLogoH).fill("#f0f0f0");
  if (logoBuf) {
    try {
      doc.image(logoBuf, dLogoX + 8, dLogoY + 6, { fit: [dLogoW - 16, dLogoH - 12] });
    } catch { /* skip */ }
  }

  // X markers at corners of clear space
  const markers = [
    [dLogoX - space, dLogoY - space],
    [dLogoX + dLogoW + space, dLogoY - space],
    [dLogoX - space, dLogoY + dLogoH + space],
    [dLogoX + dLogoW + space, dLogoY + dLogoH + space],
  ];
  markers.forEach(([mx, my]) => {
    doc.font("Helvetica").fontSize(9).fillColor([ar, ag, ab])
      .text("×", mx - 4, my - 5);
  });

  // Label
  doc.font("Helvetica").fontSize(7).fillColor("#999999")
    .text("Minimum clear space (= X) on all sides", MG, dLogoY + dLogoH + space + 10, {
      width: CW, align: "center",
    });

  footer(doc, 2, brandName);
}

// ── Page 3 — Color Palette ─────────────────────────────────────────────────────
function pageColors(
  doc:       PDFKit.PDFDocument,
  brandName: string,
  colors:    BrandColor[],
  accent:    string,
) {
  sidebar(doc, accent);
  titleBlock(doc, "03 — Colour System", "Color Palette", accent);

  const { r: ar, g: ag, b: ab } = hexToRgb(accent);

  let y = 80;
  y = sectionDivider(doc, "Brand Colors", y, accent);

  const count   = Math.min(colors.length, 6);
  const swatchW = count <= 2 ? 130 : Math.min(90, Math.floor(CW / count) - 10);
  const swatchH = 110;
  const colorH  = 70;  // coloured portion height
  const infoH   = swatchH - colorH; // white info portion height
  const gap     = 12;

  colors.slice(0, 6).forEach((c, i) => {
    const x = MG + i * (swatchW + gap);
    const { r, g, b } = c.rgb;
    const cmyk = rgbToCmyk(r, g, b);

    // Color swatch top portion
    doc.rect(x, y, swatchW, colorH).fill([r, g, b]);

    // White info section
    doc.rect(x, y + colorH, swatchW, infoH).fill("#ffffff");

    // HEX label in info section
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#111111")
      .text(c.hex.toUpperCase(), x + 4, y + colorH + 4, { width: swatchW - 8 });

    // RGB
    doc.font("Helvetica").fontSize(7).fillColor("#666666")
      .text(`RGB ${r}, ${g}, ${b}`, x + 4, y + colorH + 17, { width: swatchW - 8 });

    // CMYK below swatch
    doc.font("Helvetica").fontSize(7).fillColor("#666666")
      .text(`CMYK ${cmyk.c} ${cmyk.m} ${cmyk.y} ${cmyk.k}`, x, y + swatchH + 4, {
        width: swatchW,
      });

    // Usage tag
    doc.font("Helvetica-Bold").fontSize(7).fillColor([ar, ag, ab])
      .text(c.usage, x, y + swatchH + 16, { width: swatchW });
  });

  y += swatchH + 50;

  // Color Pairing Guide
  y = sectionDivider(doc, "Color Pairing Guide", y, accent);

  const pairings = [
    { bg: accent,   fg: isLight(accent) ? "#111111" : "#ffffff", label: `${accent} on white`,  note: "Primary CTAs, headings, links" },
    { bg: "#ffffff", fg: accent,                                   label: "White on accent",     note: "Reversed text, inverted buttons" },
    { bg: "#111111", fg: "#ffffff",                                label: "White on dark",       note: "Dark-mode components, footers" },
  ];

  const pW = Math.floor((CW - 16) / pairings.length);
  pairings.forEach((pair, i) => {
    const px = MG + i * (pW + 8);
    const { r: br, g: bg, b: bb } = hexToRgb(pair.bg);
    doc.rect(px, y, pW, 40).fill([br, bg, bb]);
    const { r: fr, g: fg2, b: fb } = hexToRgb(pair.fg);
    doc.font("Helvetica-Bold").fontSize(9).fillColor([fr, fg2, fb])
      .text("Aa", px + 8, y + 12);
    doc.font("Helvetica").fontSize(7).fillColor("#888888")
      .text(pair.label, px, y + 46, { width: pW })
      .text(pair.note, px, y + 57, { width: pW });
  });

  footer(doc, 3, brandName);
}

// ── Page 4 — Typography ────────────────────────────────────────────────────────
function pageTypography(
  doc:       PDFKit.PDFDocument,
  brandName: string,
  accent:    string,
) {
  sidebar(doc, accent);
  titleBlock(doc, "04 — Type System", "Typography", accent);

  const { r: ar, g: ag, b: ab } = hexToRgb(accent);
  let y = 80;
  y = sectionDivider(doc, "Primary Typeface", y, accent);

  // Two-column layout
  const colW = (CW - 20) / 2;

  // Left: large Aa specimen
  doc.font("Helvetica-Bold").fontSize(72).fillColor([ar, ag, ab])
    .text("Aa", MG, y - 4, { width: colW });

  doc.font("Helvetica-Bold").fontSize(11).fillColor("#1a1a1a")
    .text("Helvetica / Arial", MG, y + 72);
  doc.font("Helvetica").fontSize(9).fillColor("#777777")
    .text("Sans-serif — Geometric\nHeadings, display, brand mark", MG, y + 87, {
      width: colW, lineGap: 2,
    });

  // Right: character set
  const rx = MG + colW + 20;
  doc.font("Helvetica").fontSize(9).fillColor("#555555")
    .text(
      "ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\nabcdefghijklm\nnopqrstuvwxyz\n0123456789",
      rx, y, { width: colW, lineGap: 5 },
    );

  y += 140;
  y = sectionDivider(doc, "Type Scale", y, accent);

  const scale = [
    { label: "Display",  size: 32, weight: "Helvetica-Bold" },
    { label: "H1",       size: 24, weight: "Helvetica-Bold" },
    { label: "H2",       size: 18, weight: "Helvetica-Bold" },
    { label: "H3",       size: 14, weight: "Helvetica-Bold" },
    { label: "Body",     size: 11, weight: "Helvetica"      },
    { label: "Caption",  size:  9, weight: "Helvetica"      },
  ];

  scale.forEach(({ label, size, weight }) => {
    // Dot indicator scaled by font size
    const dotR = Math.max(3, Math.round(size / 6));
    doc.circle(MG + 6, y + size / 2, dotR).fill([ar, ag, ab]);

    // Label
    doc.font("Helvetica").fontSize(8).fillColor("#aaaaaa")
      .text(`${label} — ${size}pt`, MG + 18, y + size / 2 - 4, { width: 100 });

    // Specimen text
    doc.font(weight).fontSize(size).fillColor("#1a1a1a")
      .text(brandName, MG + 130, y);

    y += Math.max(size + 12, 24);
  });

  footer(doc, 4, brandName);
}

// ── Page 5 — Usage Rules ───────────────────────────────────────────────────────
function pageUsage(
  doc:       PDFKit.PDFDocument,
  brandName: string,
  accent:    string,
) {
  sidebar(doc, accent);
  titleBlock(doc, "05 — Usage Rules", "Logo Usage", accent);

  const { r: ar, g: ag, b: ab } = hexToRgb(accent);
  let y = 80;
  y = sectionDivider(doc, "Dos & Don'ts", y, accent);

  const dos = [
    "Always use approved logo files",
    "Maintain minimum clear space equal to cap height",
    "Use full-color version on light backgrounds",
    "Use white version on dark or brand-color backgrounds",
    "Scale proportionally — never stretch or squash",
  ];

  const donts = [
    "Don't alter the logo's colors",
    "Don't add drop shadows, outlines, or effects",
    "Don't rotate or skew the logo",
    "Don't place on busy or low-contrast backgrounds",
    "Don't use the logo smaller than 16px on screen",
  ];

  const colW = (CW - 16) / 2;

  // DO header bar
  doc.rect(MG, y, colW, 22).fill([ar, ag, ab]);
  doc.font("Helvetica-Bold").fontSize(9)
    .fillColor(isLight(accent) ? "#111111" : "#ffffff")
    .text("DO", MG + 10, y + 7, { characterSpacing: 1 });
  y += 28;

  let dyDo = y;
  dos.forEach((item) => {
    // Bullet dot
    doc.circle(MG + 6, dyDo + 5, 3).fill([ar, ag, ab]);
    doc.font("Helvetica").fontSize(9).fillColor("#333333")
      .text(item, MG + 18, dyDo, { width: colW - 22 });
    dyDo += 22;
    // Thin separator
    doc.rect(MG, dyDo - 4, colW, 0.5).fill("#e5e5e5");
  });

  // DON'T header bar
  const x2   = MG + colW + 16;
  let y2Start = y - 28;
  doc.rect(x2, y2Start, colW, 22).fill("#ef4444");
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff")
    .text("DON'T", x2 + 10, y2Start + 7, { characterSpacing: 1 });
  y2Start += 28;

  let dyDont = y2Start;
  donts.forEach((item) => {
    doc.circle(x2 + 6, dyDont + 5, 3).fill("#ef4444");
    doc.font("Helvetica").fontSize(9).fillColor("#333333")
      .text(item, x2 + 18, dyDont, { width: colW - 22 });
    dyDont += 22;
    doc.rect(x2, dyDont - 4, colW, 0.5).fill("#e5e5e5");
  });

  let yNext = Math.max(dyDo, dyDont) + 20;
  yNext = sectionDivider(doc, "Digital Specifications", yNext, accent);

  // Specifications table
  const specs = [
    ["Web minimum size",  "32px"],
    ["Print minimum",     "0.75 in"],
    ["Color mode",        "RGB for digital  /  CMYK for print"],
    ["File formats",      "SVG, PNG, PDF"],
  ];

  const tableW   = CW;
  const rowH     = 22;
  const labelCol = 180;

  specs.forEach((row, i) => {
    const rowY = yNext + i * rowH;
    const bg   = i % 2 === 0 ? "#f9f9f9" : "#ffffff";
    doc.rect(MG, rowY, tableW, rowH).fill(bg);

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#555555")
      .text(row[0], MG + 8, rowY + 6, { width: labelCol });
    doc.font("Helvetica").fontSize(9).fillColor("#111111")
      .text(row[1], MG + labelCol + 8, rowY + 6, { width: tableW - labelCol - 16 });
  });

  footer(doc, 5, brandName);
}

// ── Main export ────────────────────────────────────────────────────────────────
export async function buildLogoPrepPDF(opts: {
  brandName: string;
  colors:    BrandColor[];
  logoBuf:   Buffer | null;
}): Promise<Buffer> {
  const { brandName, colors, logoBuf } = opts;
  const accent = colors[0]?.hex || "#7c3aed";

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: [PW, PH],
      margin: 0,
      info: {
        Title:   `${brandName} — Brand Guidelines`,
        Author:  "CreaCurve",
        Subject: "Brand Identity Manual",
      },
    });

    doc.on("data",  (c: Buffer) => chunks.push(c));
    doc.on("end",   () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    pageCover(doc, brandName, logoBuf, accent);

    doc.addPage({ size: [PW, PH], margin: 0 });
    pageLogo(doc, brandName, logoBuf, accent);

    doc.addPage({ size: [PW, PH], margin: 0 });
    pageColors(doc, brandName, colors, accent);

    doc.addPage({ size: [PW, PH], margin: 0 });
    pageTypography(doc, brandName, accent);

    doc.addPage({ size: [PW, PH], margin: 0 });
    pageUsage(doc, brandName, accent);

    doc.end();
  });
}
