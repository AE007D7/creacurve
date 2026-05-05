import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLANS: Record<string, { name: string; amount: number }> = {
  starter:      { name: "Starter Logo Design",      amount: 3500  },
  professional: { name: "Professional Logo Design",  amount: 11900 },
  platinum:     { name: "Platinum Logo Design",      amount: 29900 },
};

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let plan: string;
  try {
    const body = await req.json() as { plan: string };
    plan = body.plan?.toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const selected = PLANS[plan];
  if (!selected) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const origin = req.headers.get("origin") ?? "https://creacurve.com";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: selected.amount,
            product_data: {
              name: selected.name,
              description:
                plan === "starter"
                  ? "4 logo concepts · 2 designers · 4 revisions · JPEG · 24–48h turnaround"
                  : plan === "professional"
                  ? "12 logo concepts · 4 specialists · Unlimited revisions · SVG/PNG/PDF/EPS · 24–48h turnaround"
                  : "Unlimited concepts · 8 designers · Unlimited revisions · Full brand kit · Priority turnaround",
            },
          },
        },
      ],
      success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[logo-checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
