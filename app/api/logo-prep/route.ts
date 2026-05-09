import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";
import { extractLogoColors } from "@/lib/render/color-extractor";
import { buildBrandGuidelinesPDF } from "@/lib/render/pdf-builder";
import type { BrandData } from "@/lib/types";

const REMOVE_BG_API = "https://api.remove.bg/v1.0/removebg";

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

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const brandName = ((form.get("brandName") as string) || "My Brand").trim() || "My Brand";

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Background removal not configured" }, { status: 503 });

    const inputBuf = Buffer.from(await file.arrayBuffer());

    // ── 1. Remove background ──────────────────────────────────────────────
    const rbgForm = new FormData();
    rbgForm.append("image_file", new Blob([inputBuf], { type: file.type }), file.name);
    rbgForm.append("size", "auto");

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

    // ── 2. Generate all variants in parallel ──────────────────────────────
    const [blackBuf, whiteBuf, onWhiteBuf, onDarkBuf, colors] = await Promise.all([
      colorize(transparentBuf, 0, 0, 0),
      colorize(transparentBuf, 255, 255, 255),
      flattenOnto(transparentBuf, { r: 255, g: 255, b: 255 }),
      flattenOnto(transparentBuf, { r: 20, g: 20, b: 30 }),
      extractLogoColors(transparentBuf),
    ]);

    // ── 3. Build minimal BrandData from extracted colors ──────────────────
    const primary   = colors.slice(0, 2);
    const secondary = colors.slice(2, 4);
    const accent    = colors.slice(4);

    const brandData: BrandData = {
      primaryColors:   primary.length   ? primary   : [{ hex: "#111111", rgb: { r: 17,  g: 17,  b: 17  }, name: "Ink",    usage: "Primary" }],
      secondaryColors: secondary.length ? secondary : [{ hex: "#666666", rgb: { r: 102, g: 102, b: 102 }, name: "Stone",  usage: "Secondary" }],
      accentColors:    accent.length    ? accent    : [{ hex: "#7c3aed", rgb: { r: 124, g: 58,  b: 237 }, name: "Violet", usage: "Accent" }],
      style: "minimal",
      personality: ["Professional", "Modern", "Trustworthy"],
      industry: "General",
      targetAudience: "General audience",
      fontPairings: [
        {
          heading: "Inter",
          body: "Inter",
          mood: "Clean and modern",
          googleFontsUrl: "https://fonts.google.com/specimen/Inter",
        },
      ],
      brandVoice: {
        tone: "Professional and approachable",
        vocabulary: ["Quality", "Innovation", "Trust"],
        examples: [`${brandName} delivers excellence in every detail.`],
      },
      taglineSuggestions: [`${brandName} — Built to last.`, `The mark of quality.`],
      designPrinciples: ["Clarity", "Consistency", "Confidence"],
    };

    // ── 4. Build PDF ───────────────────────────────────────────────────────
    // Pass the transparent PNG as a data URL so the PDF builder can embed it
    const logoDataUrl = `data:image/png;base64,${transparentBuf.toString("base64")}`;
    const pdfBuf = await buildBrandGuidelinesPDF({ brandName, brandData, logoUrl: logoDataUrl });

    // ── 5. Pack ZIP ────────────────────────────────────────────────────────
    const zip = new JSZip();
    const folder = zip.folder("logo-files")!;
    folder.file("logo-transparent.png",   transparentBuf);
    folder.file("logo-black.png",         blackBuf);
    folder.file("logo-white.png",         whiteBuf);
    folder.file("logo-on-white.png",      onWhiteBuf);
    folder.file("logo-on-dark.png",       onDarkBuf);
    folder.file("brand-guidelines.pdf",   pdfBuf);

    const zipBuf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

    return new NextResponse(zipBuf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${brandName.replace(/\s+/g, "-").toLowerCase()}-logo-files.zip"`,
      },
    });
  } catch (err) {
    console.error("logo-prep error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
