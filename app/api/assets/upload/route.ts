import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const maxDuration = 60;

const VALID_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PNG, JPG, SVG, or WebP." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    // Try Supabase first if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project")) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const filePath = `uploads/${fileName}`;
        const { error } = await supabase.storage
          .from("logos")
          .upload(filePath, buffer, { contentType: file.type, upsert: false });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from("logos")
            .getPublicUrl(filePath);

          return NextResponse.json({ url: publicUrl, path: filePath, filename: file.name });
        }
        console.warn("[Upload] Supabase upload failed, falling back to local:", error.message);
      } catch (err) {
        console.warn("[Upload] Supabase error, falling back to local:", err);
      }
    }

    // Local filesystem fallback (dev / no Supabase)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const publicUrl = `${siteUrl}/uploads/${fileName}`;

    return NextResponse.json({ url: publicUrl, path: `uploads/${fileName}`, filename: file.name });
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
