import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";

const REMOVE_BG_API = "https://api.remove.bg/v1.0/removebg";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Background removal not configured" }, { status: 503 });

    const bytes = await file.arrayBuffer();
    const inputBuf = Buffer.from(bytes);

    // Remove background via remove.bg
    const rbgForm = new FormData();
    rbgForm.append("image_file", new Blob([inputBuf], { type: file.type }), file.name);
    rbgForm.append("size", "auto");

    const rbgRes = await fetch(REMOVE_BG_API, {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: rbgForm,
    });

    if (!rbgRes.ok) {
      const errText = await rbgRes.text();
      console.error("remove.bg error:", errText);
      return NextResponse.json({ error: "Background removal failed" }, { status: 502 });
    }

    const transparentBuf = Buffer.from(await rbgRes.arrayBuffer());

    // Black version: keep alpha, set RGB to 0
    const blackBuf = await (async () => {
      const { data, info } = await sharp(transparentBuf)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const blackData = Buffer.alloc(data.length);
      for (let i = 0; i < data.length; i += 4) {
        blackData[i] = 0;
        blackData[i + 1] = 0;
        blackData[i + 2] = 0;
        blackData[i + 3] = data[i + 3];
      }

      return sharp(blackData, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png()
        .toBuffer();
    })();

    // White version
    const whiteBuf = await (async () => {
      const { data, info } = await sharp(transparentBuf)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const whiteData = Buffer.alloc(data.length);
      for (let i = 0; i < data.length; i += 4) {
        whiteData[i] = 255;
        whiteData[i + 1] = 255;
        whiteData[i + 2] = 255;
        whiteData[i + 3] = data[i + 3];
      }

      return sharp(whiteData, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png()
        .toBuffer();
    })();

    // Build ZIP
    const zip = new JSZip();
    const folder = zip.folder("logo-files")!;
    folder.file("logo-transparent.png", transparentBuf);
    folder.file("logo-black.png", await blackBuf);
    folder.file("logo-white.png", whiteBuf);

    const zipBuf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

    return new NextResponse(zipBuf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="logo-files.zip"',
      },
    });
  } catch (err) {
    console.error("logo-prep error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
