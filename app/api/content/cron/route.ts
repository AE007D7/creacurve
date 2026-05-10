/**
 * Daily cron endpoint — auto-generates one content piece per active profile.
 * Trigger via Vercel Cron (vercel.json) or any external cron service.
 * Protected by CRON_SECRET env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateContentPiece, generateTopics } from "@/lib/content/generator";
import { getProfiles, saveContentPiece } from "@/lib/content/db";
import { CATEGORY_ROTATION } from "@/lib/content/types";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const token  = req.headers.get("authorization")?.replace("Bearer ", "")
               ?? req.nextUrl.searchParams.get("secret");

  if (secret && token !== secret)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profiles = await getProfiles();
    if (!profiles.length) return NextResponse.json({ ok: true, generated: 0 });

    // Determine today's category based on day-of-week index
    const dayIndex = new Date().getDay(); // 0=Sun
    const category = CATEGORY_ROTATION[dayIndex % CATEGORY_ROTATION.length];

    const results = await Promise.allSettled(
      profiles.map(async (profile) => {
        // Generate a fresh topic for today
        const [topicPlan] = await generateTopics(profile, 1);
        const topic       = topicPlan?.topic ?? `${profile.niche} tips for ${profile.audience}`;

        const content = await generateContentPiece(profile, category, topic);
        return saveContentPiece({
          profile_id:   profile.id,
          status:       "draft",
          scheduled_at: null,
          posted_at:    null,
          ...content,
        });
      }),
    );

    const generated = results.filter((r) => r.status === "fulfilled").length;
    const failed    = results.filter((r) => r.status === "rejected").length;

    console.log(`[cron] Content generated: ${generated}, failed: ${failed}`);
    return NextResponse.json({ ok: true, generated, failed });
  } catch (err) {
    console.error("[cron] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
