import { NextRequest, NextResponse } from "next/server";
import { getContentPieces, updateContentStatus, deleteContentPiece } from "@/lib/content/db";
import type { ContentStatus } from "@/lib/content/types";

function auth(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const token  = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return !secret || token === secret;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const result = await getContentPieces({
    profile_id: searchParams.get("profile_id") ?? undefined,
    status:     (searchParams.get("status") as ContentStatus) ?? undefined,
    limit:      Number(searchParams.get("limit") ?? "20"),
    offset:     Number(searchParams.get("offset") ?? "0"),
  });
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { id: string; status: ContentStatus; scheduled_at?: string };
  await updateContentStatus(body.id, body.status, { scheduled_at: body.scheduled_at });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteContentPiece(id);
  return NextResponse.json({ ok: true });
}
