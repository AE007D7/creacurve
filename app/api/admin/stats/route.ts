import { NextRequest, NextResponse } from "next/server";
import { getLogoStats } from "@/lib/stats";

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const token  = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getLogoStats();
  return NextResponse.json(stats);
}
