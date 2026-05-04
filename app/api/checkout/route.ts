import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

const isDev = !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY.includes("placeholder") ||
  process.env.STRIPE_SECRET_KEY === "";

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
  process.env.SUPABASE_SERVICE_KEY
);

// Local project store for dev mode
async function saveLocalProject(project: Record<string, unknown>) {
  const dir = path.join(process.cwd(), ".dev-data");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${project.id}.json`);
  await writeFile(file, JSON.stringify(project, null, 2));
}

export async function GET(req: NextRequest) {
  // Used by processing page in dev mode to load local project
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const file = path.join(process.cwd(), ".dev-data", `${id}.json`);
    const data = await readFile(file, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { logoUrl, brandName, filename } = await req.json();

    if (!logoUrl) {
      return NextResponse.json({ error: "Logo URL required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const projectId = randomUUID();

    // ── DEV MODE: no Stripe, no Supabase ──────────────────────────────────
    if (isDev || !isSupabaseConfigured) {
      const project = {
        id: projectId,
        logo_url: logoUrl,
        brand_name: brandName || filename?.replace(/\.[^/.]+$/, "") || "My Brand",
        original_filename: filename || null,
        status: "processing",
        progress: 0,
        brand_data: null,
        zip_url: null,
        created_at: new Date().toISOString(),
        completed_at: null,
        error_message: null,
        user_id: "dev-user",
      };

      await saveLocalProject(project);

      // Kick off generation in background
      fetch(`${siteUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET || "creacurve-internal",
        },
        body: JSON.stringify({ projectId, devMode: true }),
      }).catch((err) => console.error("[Checkout] Failed to kick generation:", err));

      return NextResponse.json({
        url: `${siteUrl}/processing/${projectId}?dev=1`,
        projectId,
        dev: true,
      });
    }

    // ── PRODUCTION MODE: Supabase + Stripe ────────────────────────────────
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const tempUserId = randomUUID();

    await supabase.from("users").upsert({
      id: tempUserId,
      email: `guest-${tempUserId}@creacurve.com`,
    });

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        id: projectId,
        user_id: tempUserId,
        logo_url: logoUrl,
        original_filename: filename || null,
        brand_name: brandName || null,
        status: "pending",
        progress: 0,
      })
      .select()
      .single();

    if (projectError || !project) {
      throw projectError || new Error("Failed to create project");
    }

    const { createCheckoutSession } = await import("@/lib/stripe");
    const checkoutUrl = await createCheckoutSession({
      userId: tempUserId,
      projectId,
      brandName: brandName || "Your Brand",
      logoUrl,
      successUrl: `${siteUrl}/processing/${projectId}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/create?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutUrl, projectId });
  } catch (error) {
    console.error("[Checkout] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Checkout failed: ${message}` }, { status: 500 });
  }
}
