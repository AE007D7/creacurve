import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Paddle sends a signature header we verify to reject forged requests.
// Secret is set in Paddle dashboard → Notifications → your webhook endpoint.
async function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;

  // Header format: "ts=1234567890;h1=abc123..."
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const payload = `${ts}:${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === h1;
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookSecret) {
    console.error("[paddle-webhook] PADDLE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("paddle-signature");

  const valid = await verifyPaddleSignature(rawBody, signatureHeader, webhookSecret);
  if (!valid) {
    console.warn("[paddle-webhook] Invalid signature — request rejected");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.event_type as string;

  // Only handle completed transactions
  if (eventType !== "transaction.completed") {
    return NextResponse.json({ received: true });
  }

  const data = event.data as Record<string, unknown>;
  const customer = (data.customer as Record<string, unknown>) ?? {};
  const details = (data.details as Record<string, unknown>) ?? {};
  const totals = (details.totals as Record<string, unknown>) ?? {};
  const items = (data.items as Record<string, unknown>[]) ?? [];

  const customerEmail = (customer.email as string) ?? "—";
  const customerName = (customer.name as string) ?? "—";
  const transactionId = (data.id as string) ?? "—";
  const currency = (totals.currency_code as string) ?? "USD";
  const total = totals.total ? `${Number(totals.total) / 100} ${currency}` : "—";

  const itemLines = items
    .map((item) => {
      const price = (item.price as Record<string, unknown>) ?? {};
      return `<tr>
        <td style="padding:6px 0;color:#111">${esc(String(price.description ?? price.name ?? "Item"))}</td>
        <td style="padding:6px 0;text-align:right;color:#111">${esc(String(item.quantity ?? 1))} × ${esc(String(price.unit_price ?? "—"))}</td>
      </tr>`;
    })
    .join("");

  if (!resendKey) {
    console.error("[paddle-webhook] RESEND_API_KEY not set — skipping email");
    return NextResponse.json({ received: true });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "CreaCurve Orders <onboarding@resend.dev>",
      to: "ayoubelkihel7@gmail.com",
      subject: `New order — ${customerName} (${transactionId})`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
          <h2 style="margin:0 0 20px;font-size:20px;border-bottom:1px solid #eee;padding-bottom:16px">
            New Paddle order received
          </h2>

          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#666;width:140px">Transaction ID</td><td style="padding:6px 0;font-weight:600">${esc(transactionId)}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Customer name</td>             <td style="padding:6px 0">${esc(customerName)}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Customer email</td>            <td style="padding:6px 0"><a href="mailto:${esc(customerEmail)}" style="color:#7c3aed">${esc(customerEmail)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666">Total charged</td>             <td style="padding:6px 0;font-weight:600">${esc(total)}</td></tr>
          </table>

          <h3 style="font-size:14px;font-weight:600;margin:0 0 10px">Items</h3>
          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
            ${itemLines}
          </table>

          <p style="margin:24px 0 0;font-size:12px;color:#999">
            Received ${new Date().toUTCString()} · Paddle webhook · CreaCurve
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[paddle-webhook] Failed to send email:", err);
    // Still return 200 so Paddle doesn't retry — the order is confirmed, email is secondary
  }

  return NextResponse.json({ received: true });
}
