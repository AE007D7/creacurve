import { NextRequest, NextResponse } from "next/server";
import { getProfiles, upsertProfile } from "@/lib/content/db";
import type { BusinessProfile } from "@/lib/content/types";

function auth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const token  = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return !secret || token === secret;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profiles = await getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Partial<BusinessProfile> & { id?: string };
  const { id, ...rest } = body;

  const profile = await upsertProfile(
    rest as Omit<BusinessProfile, "id" | "created_at" | "updated_at">,
    id,
  );
  return NextResponse.json(profile);
}
