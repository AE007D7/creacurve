import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildDeliveryEmail } from "@/lib/email/templates";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  try {
    const { projectId, zipUrl, brandName, brandData } = await req.json();

    // Get user email
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("email")
      .eq("id", project.user_id)
      .single();

    if (!user?.email || user.email.includes("anon-")) {
      // Anonymous user — no email to send to
      return NextResponse.json({ message: "Anonymous user, skipping email" });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creacurve.com";

    const html = buildDeliveryEmail({
      brandName: brandName || "Your Brand",
      downloadUrl: zipUrl,
      dashboardUrl: `${siteUrl}/dashboard/${projectId}`,
      brandData,
    });

    const { error } = await resend.emails.send({
      from: "CreaCurve <hello@creacurve.com>",
      to: user.email,
      subject: `Your CreaCurve brand kit is ready ✨`,
      html,
    });

    if (error) throw error;

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
