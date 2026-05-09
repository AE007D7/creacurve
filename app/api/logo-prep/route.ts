import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";
import Anthropic from "@anthropic-ai/sdk";
import { extractLogoColors } from "@/lib/render/color-extractor";
import { buildLogoPrepPDF } from "@/lib/render/logo-prep-pdf";
import { buildBrandBoard, buildCardMockup3D, buildFaviconSet } from "@/lib/render/logo-mockup";

const REMOVE_BG_API = "https://api.remove.bg/v1.0/removebg";

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

async function flattenOnto(transparent: Buffer, bg: { r: number; g: number; b: number }): Promise<Buffer> {
  return sharp(transparent).flatten({ background: bg }).png().toBuffer();
}

/**
 * Uses Claude vision to detect the icon/symbol bounding box inside the logo.
 * Falls back to auto-trim if Claude cannot find a distinct icon.
 */
async function extractIcon(transparentBuf: Buffer): Promise<Buffer> {
  try {
    const base64 = transparentBuf.toString("base64");
    const meta   = await sharp(transparentBuf).metadata();
    const W = meta.width!, H = meta.height!;

    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: base64 },
          },
          {
            type: "text",
            text: `This logo is on a transparent background (${W}×${H}px). If there is a distinct graphical icon or symbol SEPARATE from any text/wordmark, return its pixel bounding box as JSON: {"x":0,"y":0,"w":100,"h":100}. If it is text-only or you cannot identify a separate icon, return {"full":true}. Return ONLY the JSON.`,
          },
        ],
      }],
    });

    const text = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    const json = JSON.parse(text.replace(/```json?|```/g, "").trim());

    if (json.full) throw new Error("full logo");

    const x = Math.max(0, Math.round(json.x));
    const y = Math.max(0, Math.round(json.y));
    const w = Math.min(W - x, Math.round(json.w));
    const h = Math.min(H - y, Math.round(json.h));

    return sharp(transparentBuf).extract({ left: x, top: y, width: w, height: h }).png().toBuffer();
  } catch {
    // Fallback: trim transparent edges, use whole logo
    return sharp(transparentBuf).trim({ background: "transparent" }).png().toBuffer();
  }
}

/* ── Route ───────────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const brandName = ((form.get("brandName") as string) || "My Brand").trim() || "My Brand";

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Background removal not configured" }, { status: 503 });

    const inputBuf = Buffer.from(await file.arrayBuffer());

    // ── 1. Save original as PNG and JPEG ─────────────────────────────────
    const [originalPng, originalJpg] = await Promise.all([
      sharp(inputBuf).png().toBuffer(),
      sharp(inputBuf).flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg({ quality: 95 }).toBuffer(),
    ]);

    // ── 2. Remove background (full resolution) ────────────────────────────
    const rbgForm = new FormData();
    rbgForm.append("image_file", new Blob([inputBuf], { type: file.type }), file.name);
    rbgForm.append("size", "full");

    const rbgRes = await fetch(REMOVE_BG_API, {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: rbgForm,
    });

    if (!rbgRes.ok) {
      console.error("remove.bg error:", await rbgRes.text());
      return NextResponse.json({ error: "Background removal failed" }, { status: 502 });
    }

    const transparentBuf = Buffer.from(await rbgRes.arrayBuffer());

    // ── 3. All variants + icon extraction in parallel ─────────────────────
    const [blackBuf, whiteBuf, onWhiteBuf, onDarkBuf, colors, iconBuf] = await Promise.all([
      colorize(transparentBuf, 0, 0, 0),
      colorize(transparentBuf, 255, 255, 255),
      flattenOnto(transparentBuf, { r: 255, g: 255, b: 255 }),
      flattenOnto(transparentBuf, { r: 14, g: 14, b: 24 }),
      extractLogoColors(transparentBuf),
      extractIcon(transparentBuf),
    ]);

    const accentHex = colors[0]?.hex || "#7c3aed";

    // ── 4. Favicons from icon ─────────────────────────────────────────────
    const favicons = await buildFaviconSet(iconBuf);

    // ── 5. Mockups + PDF in parallel ──────────────────────────────────────
    const [mockup2d, mockup3d, pdfBuf] = await Promise.all([
      buildBrandBoard(transparentBuf, accentHex),
      buildCardMockup3D(transparentBuf, accentHex),
      buildLogoPrepPDF({ brandName, colors, logoBuf: transparentBuf }),
    ]);

    // ── 6. Pack ZIP ───────────────────────────────────────────────────────
    const zip = new JSZip();

    const originals = zip.folder("01-originals")!;
    originals.file("logo-original.png",  originalPng);
    originals.file("logo-original.jpg",  originalJpg);

    const variants = zip.folder("02-variants")!;
    variants.file("logo-transparent.png", transparentBuf);
    variants.file("logo-black.png",        blackBuf);
    variants.file("logo-white.png",        whiteBuf);
    variants.file("logo-on-white.png",     onWhiteBuf);
    variants.file("logo-on-dark.png",      onDarkBuf);

    const favFolder = zip.folder("03-favicons")!;
    favFolder.file("favicon-16.png",  favicons.s16);
    favFolder.file("favicon-32.png",  favicons.s32);
    favFolder.file("favicon-192.png", favicons.s192);

    const mockups = zip.folder("04-mockups")!;
    mockups.file("mockup-brand-board.png", mockup2d);
    mockups.file("mockup-3d-card.png",     mockup3d);

    const docs = zip.folder("05-brand")!;
    docs.file("brand-guidelines.pdf", pdfBuf);

    const zipBuf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

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
