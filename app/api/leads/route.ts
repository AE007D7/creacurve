import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(30).optional(),
  service: z.string().min(1, "Service is required"),
  industry: z.string().min(1, "Industry is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  projectDetails: z.string().max(2000).optional(),
  source: z.string().max(50).optional().default("form"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.message;
    return NextResponse.json({ success: false, message: errors }, { status: 400 });
  }

  const lead = parsed.data;

  console.log("[leads] New lead received:", {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "(not provided)",
    service: lead.service,
    industry: lead.industry,
    budgetRange: lead.budgetRange,
    projectDetails: lead.projectDetails ?? "(not provided)",
    source: lead.source,
    timestamp: new Date().toISOString(),
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "CreaCurve Leads <onboarding@resend.dev>",
        to: "ayoubelkihel7@gmail.com",
        subject: `New Lead: ${lead.name} — ${lead.service}`,
        html: `
          <h2>New Lead from CreaCurve Logo Design Page</h2>
          <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
            <tr><td><strong>Name</strong></td><td>${escapeHtml(lead.name)}</td></tr>
            <tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${escapeHtml(lead.phone ?? "—")}</td></tr>
            <tr><td><strong>Service</strong></td><td>${escapeHtml(lead.service)}</td></tr>
            <tr><td><strong>Industry</strong></td><td>${escapeHtml(lead.industry)}</td></tr>
            <tr><td><strong>Budget</strong></td><td>${escapeHtml(lead.budgetRange)}</td></tr>
            <tr><td><strong>Source</strong></td><td>${escapeHtml(lead.source ?? "form")}</td></tr>
            <tr><td><strong>Details</strong></td><td>${escapeHtml(lead.projectDetails ?? "—")}</td></tr>
            <tr><td><strong>Time</strong></td><td>${new Date().toISOString()}</td></tr>
          </table>
        `,
      });
    } catch (emailError) {
      console.error("[leads] Failed to send notification email:", emailError);
      // Do not fail the request just because the email failed
    }
  }

  return NextResponse.json(
    { success: true, message: "Thanks! We'll be in touch within 1 business day." },
    { status: 200 }
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
