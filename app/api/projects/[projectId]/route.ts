import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Try local file first (dev mode)
  try {
    const file = path.join(process.cwd(), ".dev-data", `${projectId}.json`);
    const data = await readFile(file, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    // Not a local project — try Supabase
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
