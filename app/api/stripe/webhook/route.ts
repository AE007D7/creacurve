import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

export const maxDuration = 60;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventId = event.id;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session, eventId);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error("[Stripe] Payment failed:", paymentIntent.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(
  session: Stripe.Checkout.Session,
  eventId: string
) {
  const supabase = getSupabase();
  const { userId, projectId, brandName } = session.metadata || {};

  if (!projectId) {
    console.error("[Webhook] Missing projectId in metadata");
    return;
  }

  // Idempotency check
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingPayment) {
    console.log("[Webhook] Already processed session:", session.id);
    return;
  }

  void eventId;

  await supabase.from("payments").insert({
    user_id: userId || null,
    stripe_session_id: session.id,
    amount: session.amount_total || 2900,
    status: "paid",
    project_id: projectId,
  });

  await supabase
    .from("projects")
    .update({ status: "processing", brand_name: brandName || null, progress: 1 })
    .eq("id", projectId);

  kickOffGeneration(projectId).catch((err) => {
    console.error("[Webhook] Generation kickoff failed:", err);
  });
}

async function kickOffGeneration(projectId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://creacurve.com";
  const response = await fetch(`${siteUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "creacurve-internal",
    },
    body: JSON.stringify({ projectId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Generation API returned ${response.status}: ${text}`);
  }
}
