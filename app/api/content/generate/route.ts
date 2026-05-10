import { NextRequest, NextResponse } from "next/server";
import { generateContentPiece } from "@/lib/content/generator";
import { getProfile, saveContentPiece } from "@/lib/content/db";
import type { ContentCategory } from "@/lib/content/types";

function auth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const token  = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return !secret || token === secret;
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body       = await req.json() as { profile_id: string; category: ContentCategory; topic: string };
    const { profile_id, category, topic } = body;

    if (!profile_id || !category || !topic)
      return NextResponse.json({ error: "profile_id, category, and topic are required" }, { status: 400 });

    const profile = await getProfile(profile_id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const content = await generateContentPiece(profile, category, topic);

    const saved = await saveContentPiece({
      profile_id,
      status:       "draft",
      scheduled_at: null,
      posted_at:    null,
      ...content,
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error("Content generate error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
