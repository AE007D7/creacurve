import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const ContactSchema = z.object({
  name:           z.string().min(1, "Name is required").max(100),
  email:          z.string().email("Valid email is required"),
  phone:          z.string().max(30).optional(),
  service:        z.string().min(1, "Service is required"),
  industry:       z.string().min(1, "Industry is required"),
  budgetRange:    z.string().min(1, "Budget range is required"),
  projectDetails: z.string().max(2000).optional(),
  source:         z.string().max(50).optional().default("form"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.message }, { status: 400 });
  }

  const d = parsed.data;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from:    "CreaCurve <onboarding@resend.dev>",
      to:      "ayoubelkihel7@gmail.com",
      replyTo: d.email,
      subject: `New enquiry from ${d.name} — ${d.service}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
          <h2 style="margin:0 0 24px;font-size:20px;border-bottom:1px solid #eee;padding-bottom:16px">
            New contact form submission
          </h2>
          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:140px">Name</td>        <td style="padding:8px 0;font-weight:600">${esc(d.name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td>       <td style="padding:8px 0"><a href="mailto:${esc(d.email)}" style="color:#7c3aed">${esc(d.email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td>       <td style="padding:8px 0">${esc(d.phone ?? "—")}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Service</td>     <td style="padding:8px 0">${esc(d.service)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Industry</td>    <td style="padding:8px 0">${esc(d.industry)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Budget</td>      <td style="padding:8px 0">${esc(d.budgetRange)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Source</td>      <td style="padding:8px 0">${esc(d.source ?? "form")}</td></tr>
            <tr>
              <td style="padding:8px 0;color:#666;vertical-align:top">Details</td>
              <td style="padding:8px 0;white-space:pre-wrap">${esc(d.projectDetails ?? "—")}</td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:#999">
            Sent ${new Date().toUTCString()} · CreaCurve contact form
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return NextResponse.json({ success: false, message: "Failed to send email. Please try again." }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, message: "Thanks! We'll be in touch within 1 business day." },
    { status: 200 }
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
