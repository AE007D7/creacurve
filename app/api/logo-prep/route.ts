import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";
import Anthropic from "@anthropic-ai/sdk";
import { extractLogoColors } from "@/lib/render/color-extractor";
import { buildLogoPrepPDF } from "@/lib/render/logo-prep-pdf";
import { buildBrandBoard, buildCardMockup3D, buildFaviconSet } from "@/lib/render/logo-mockup";
import { buildCopyrightCert } from "@/lib/render/copyright-cert";

const anthropic = new Anthropic();

/* ── helpers ─────────────────────────────────────────────────────────────── */

async function colorize(src: Buffer, r: number, g: number, b: number): Promise<Buffer> {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = data[i + 3];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function flattenOnto(src: Buffer, bg: { r: number; g: number; b: number }): Promise<Buffer> {
  return sharp(src).flatten({ background: bg }).png().toBuffer();
}

/**
 * Uses Claude vision to find the icon/symbol bounding box inside the logo.
 * Falls back to auto-trim if no distinct icon is detected.
 */
async function extractIcon(logoBuf: Buffer): Promise<Buffer> {
  try {
    const meta   = await sharp(logoBuf).metadata();
    const W = meta.width!, H = meta.height!;
    const base64 = logoBuf.toString("base64");

    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/png", data: base64 } },
          {
            type: "text",
            text: `Logo image (${W}×${H}px). If there is a distinct graphical icon/symbol separate from any text, return its pixel bounding box as JSON: {"x":0,"y":0,"w":100,"h":100}. If text-only or no clear icon, return {"full":true}. Return ONLY the JSON.`,
          },
        ],
      }],
    });

    const raw  = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    const json = JSON.parse(raw.replace(/```json?|```/g, "").trim());

    if (json.full) throw new Error("full");

    const x = Math.max(0, Math.round(json.x));
    const y = Math.max(0, Math.round(json.y));
    const w = Math.min(W - x, Math.round(json.w));
    const h = Math.min(H - y, Math.round(json.h));

    return sharp(logoBuf).extract({ left: x, top: y, width: w, height: h }).png().toBuffer();
  } catch {
    return sharp(logoBuf).trim().png().toBuffer();
  }
}

/* ── Route ───────────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const brandName  = ((form.get("brandName")  as string) || "My Brand").trim()  || "My Brand";
    const ownerName  = ((form.get("ownerName")   as string) || "").trim();

    const inputBuf = Buffer.from(await file.arrayBuffer());

    // ── 1. Normalize to PNG (used as base for all operations) ─────────────
    // Background removal is disabled — use the original upload as-is.
    // Will be re-enabled once remove.bg integration is finalized.
    const basePng = await sharp(inputBuf).ensureAlpha().png().toBuffer();

    // ── 2. Originals ──────────────────────────────────────────────────────
    const [originalPng, originalJpg] = await Promise.all([
      sharp(inputBuf).png().toBuffer(),
      sharp(inputBuf).flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg({ quality: 95 }).toBuffer(),
    ]);

    // ── 3. Variants + color extraction + icon — all in parallel ───────────
    const [blackBuf, whiteBuf, onWhiteBuf, onDarkBuf, colors, iconBuf] = await Promise.all([
      colorize(basePng, 0, 0, 0),
      colorize(basePng, 255, 255, 255),
      flattenOnto(basePng, { r: 255, g: 255, b: 255 }),
      flattenOnto(basePng, { r: 14, g: 14, b: 24 }),
      extractLogoColors(basePng),
      extractIcon(basePng),
    ]);

    const accentHex = colors[0]?.hex || "#7c3aed";

    // ── 4. Favicons ───────────────────────────────────────────────────────
    const favicons = await buildFaviconSet(iconBuf);

    // ── 5. Mockups + Brand PDF + Copyright cert — in parallel ─────────────
    const [mockup2d, mockup3d, pdfBuf, certBuf] = await Promise.all([
      buildBrandBoard(basePng, accentHex),
      buildCardMockup3D(basePng, accentHex),
      buildLogoPrepPDF({ brandName, colors, logoBuf: basePng }),
      buildCopyrightCert({ brandName, ownerName, accentHex, logoBuf: basePng }),
    ]);

    // ── 6. Pack ZIP ───────────────────────────────────────────────────────
    const zip = new JSZip();

    zip.folder("01-originals")!
      .file("logo-original.png", originalPng)
      .file("logo-original.jpg", originalJpg);

    zip.folder("02-variants")!
      .file("logo-on-white.png",  onWhiteBuf)
      .file("logo-on-dark.png",   onDarkBuf)
      .file("logo-black.png",     blackBuf)
      .file("logo-white.png",     whiteBuf);

    zip.folder("03-favicons")!
      .file("favicon-16.png",   favicons.s16)
      .file("favicon-32.png",   favicons.s32)
      .file("favicon-192.png",  favicons.s192);

    zip.folder("04-mockups")!
      .file("mockup-brand-board.png", mockup2d)
      .file("mockup-3d-card.png",     mockup3d);

    zip.folder("05-brand")!
      .file("brand-guidelines.pdf",     pdfBuf)
      .file("copyright-certificate.pdf", certBuf);

    const zipBuf  = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    const safeName = brandName.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    return new NextResponse(zipBuf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}-logo-files.zip"`,
      },
    });
  } catch (err) {
    console.error("logo-prep error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
