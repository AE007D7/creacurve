import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
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
            unit_amount: 490, // $4.90
            product_data: {
              name: "CreaCurve Logo Prep — Unlimited Access",
              description:
                "Unlimited logo prep conversions: transparent PNG, SVG, PSD, PDF, AI, favicons, brand guidelines, copyright cert & 3D mockups.",
            },
          },
        },
      ],
      success_url: `${origin}/logo-prep?unlocked=1`,
      cancel_url: `${origin}/logo-prep`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[logo-prep-checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
