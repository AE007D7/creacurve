import { NextRequest, NextResponse } from "next/server";
import { generateWeek } from "@/lib/content/generator";
import { getProfile, saveContentPiece } from "@/lib/content/db";

function auth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const token  = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return !secret || token === secret;
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body       = await req.json() as { profile_id: string; start_date?: string };
    const { profile_id, start_date } = body;

    if (!profile_id) return NextResponse.json({ error: "profile_id required" }, { status: 400 });

    const profile = await getProfile(profile_id);
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const startDate = start_date ? new Date(start_date) : new Date();
    const week      = await generateWeek(profile, startDate);

    // Save all pieces
    const saved = await Promise.all(
      week.map(({ content, plan }) =>
        saveContentPiece({
          profile_id,
          status:       "draft",
          scheduled_at: null,
          posted_at:    null,
          ...content,
          category: plan.category,
          topic:    plan.topic,
        }),
      ),
    );

    return NextResponse.json({ generated: saved.length, pieces: saved });
  } catch (err) {
    console.error("Week generate error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
