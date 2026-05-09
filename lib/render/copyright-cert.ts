/**
 * Generates a one-page Logo Copyright Certificate PDF.
 * US Letter portrait — 8.5 × 11 inches (612 × 792pt).
 */

import PDFDocument from "pdfkit";

const PW = 612;
const PH = 792;
const MG = 60;
const CW = PW - MG * 2;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function certId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CC-${ts}-${rand}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function buildCopyrightCert(opts: {
  brandName: string;
  ownerName: string;
  accentHex: string;
  logoBuf: Buffer | null;
}): Promise<Buffer> {
  const { brandName, ownerName, accentHex, logoBuf } = opts;
  const { r: ar, g: ag, b: ab } = hexToRgb(accentHex);
  const certNum  = certId();
  const today    = formatDate(new Date());

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: [PW, PH], margin: 0, info: {
      Title:   `${brandName} — Logo Copyright Certificate`,
      Author:  "CreaCurve",
      Subject: "Copyright Certificate",
    }});

    doc.on("data",  (c: Buffer) => chunks.push(c));
    doc.on("end",   () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Outer border double rule ──────────────────────────────────────────
    const B = 18; // border inset
    doc.rect(B, B, PW - B * 2, PH - B * 2).lineWidth(2).stroke([ar, ag, ab]);
    doc.rect(B + 5, B + 5, PW - (B + 5) * 2, PH - (B + 5) * 2).lineWidth(0.5).stroke([ar, ag, ab]);

    // ── Top accent band ───────────────────────────────────────────────────
    doc.rect(B + 6, B + 6, PW - (B + 6) * 2, 48).fill([ar, ag, ab]);

    // ── CreaCurve header in band ──────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#ffffff")
      .text("CREACURVE", 0, B + 18, { align: "center", width: PW, characterSpacing: 3 });

    // ── Certificate title ─────────────────────────────────────────────────
    let y = B + 70;

    doc.font("Helvetica").fontSize(9).fillColor("#aaaaaa")
      .text("CERTIFICATE OF COPYRIGHT OWNERSHIP", 0, y, { align: "center", width: PW, characterSpacing: 2 });
    y += 18;

    // Decorative thin line
    doc.moveTo(MG + 40, y).lineTo(PW - MG - 40, y).lineWidth(0.5).stroke([ar, ag, ab]);
    y += 16;

    // ── Logo image ────────────────────────────────────────────────────────
    if (logoBuf) {
      try {
        const logoSize = 100;
        doc.image(logoBuf, (PW - logoSize) / 2, y, { fit: [logoSize, logoSize], align: "center" });
        y += logoSize + 16;
      } catch { y += 10; }
    }

    // ── Main declaration text ─────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(22).fillColor("#111111")
      .text(brandName, MG, y, { align: "center", width: CW });
    y += 34;

    doc.font("Helvetica").fontSize(10).fillColor("#555555")
      .text(
        "This certificate confirms that the logo design identified above has been created and is the exclusive intellectual property of the owner named herein. All rights, title, and interest in and to the logo — including but not limited to copyright, trademark rights, and design rights — are hereby acknowledged.",
        MG + 20, y, { align: "center", width: CW - 40, lineGap: 3 },
      );
    y += 72;

    // ── Divider ───────────────────────────────────────────────────────────
    doc.moveTo(MG + 40, y).lineTo(PW - MG - 40, y).lineWidth(0.5).stroke([ar, ag, ab]);
    y += 20;

    // ── Detail rows ───────────────────────────────────────────────────────
    const rows: [string, string][] = [
      ["Brand / Logo Name",  brandName],
      ["Registered Owner",   ownerName || "As specified by the client"],
      ["Certificate Number", certNum],
      ["Date of Issue",      today],
      ["Issued By",          "CreaCurve Design Studio — creacurve.com"],
      ["Rights Granted",     "Full copyright ownership of the logo design"],
      ["Jurisdiction",       "International — Berne Convention"],
    ];

    rows.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#888888")
        .text(label.toUpperCase(), MG, y, { width: 140, characterSpacing: 0.5 });
      doc.font("Helvetica").fontSize(9).fillColor("#111111")
        .text(value, MG + 150, y, { width: CW - 150 });
      y += 20;
    });

    y += 4;
    doc.moveTo(MG + 40, y).lineTo(PW - MG - 40, y).lineWidth(0.5).stroke([ar, ag, ab]);
    y += 24;

    // ── Seal / badge area ─────────────────────────────────────────────────
    const sealX = PW / 2;
    const sealY = y + 36;
    const sealR = 36;

    // Outer ring
    doc.circle(sealX, sealY, sealR + 2).lineWidth(1).stroke([ar, ag, ab]);
    doc.circle(sealX, sealY, sealR).fill([ar, ag, ab]);

    // CC text inside seal
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#ffffff")
      .text("CC", sealX - 12, sealY - 10, { width: 24, align: "center" });
    doc.font("Helvetica").fontSize(5.5).fillColor("#ffffff")
      .text("CERTIFIED", sealX - 20, sealY + 6, { width: 40, align: "center", characterSpacing: 1 });

    y += sealR * 2 + 20;

    // ── Signature lines ───────────────────────────────────────────────────
    const sig1X = MG + 20;
    const sig2X = PW - MG - 160;
    const sigY  = y + 20;

    doc.moveTo(sig1X, sigY).lineTo(sig1X + 140, sigY).lineWidth(0.5).stroke("#cccccc");
    doc.moveTo(sig2X, sigY).lineTo(sig2X + 140, sigY).lineWidth(0.5).stroke("#cccccc");

    doc.font("Helvetica").fontSize(7.5).fillColor("#aaaaaa")
      .text("Authorized Signature", sig1X, sigY + 5, { width: 140, align: "center" })
      .text("Design Director, CreaCurve", sig2X, sigY + 5, { width: 140, align: "center" });

    // ── Footer ────────────────────────────────────────────────────────────
    doc.rect(B + 6, PH - B - 54, PW - (B + 6) * 2, 48).fill([ar, ag, ab]);
    doc.font("Helvetica").fontSize(7).fillColor("#ffffff")
      .text(
        `This document is a record of design ownership issued by CreaCurve. Certificate No. ${certNum}`,
        MG, PH - B - 43, { align: "center", width: CW },
      )
      .text(
        "For verification visit creacurve.com  ·  hello@creacurve.com",
        MG, PH - B - 28, { align: "center", width: CW },
      );

    doc.end();
  });
}
