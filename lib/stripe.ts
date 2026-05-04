import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

export const PRICE_AMOUNT = 2900; // $29.00 in cents

export async function createCheckoutSession(params: {
  userId: string;
  projectId: string;
  brandName: string;
  logoUrl: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "CreaCurve Brand Kit",
            description: `Complete brand identity package for ${params.brandName} — 60+ assets: logos, stationery, social media, merchandise, signage & more.`,
            images: [params.logoUrl],
          },
          unit_amount: PRICE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      projectId: params.projectId,
      brandName: params.brandName,
    },
    customer_email: undefined,
    billing_address_collection: "auto",
    allow_promotion_codes: true,
  });

  return session.url!;
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
