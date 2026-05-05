"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePaddle } from "@/components/logo-design/PaddleProvider";
import { openChat } from "@/lib/chat";

interface Plan {
  name: string;
  price: string;
  was: string;
  popular: boolean;
  tagline: string;
  features: string[];
  priceId: string | null;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$35",
    was: "$119",
    popular: false,
    tagline: "Perfect for startups & side projects.",
    priceId: "pri_01kqw4e7a8x6n84zjbvrxzt0b6",
    features: [
      "4 logo concepts",
      "2 designers assigned",
      "4 revisions",
      "JPEG delivery",
      "24–48 hour turnaround",
    ],
  },
  {
    name: "Professional",
    price: "$119",
    was: "$397",
    popular: true,
    tagline: "The choice of growing businesses.",
    priceId: null, // add price ID when ready
    features: [
      "12 logo concepts",
      "4 industry-specialist designers",
      "Unlimited revisions",
      "SVG, PNG, PDF, EPS files",
      "Stationery design included",
      "Email signature design",
      "24–48 hour turnaround",
    ],
  },
  {
    name: "Platinum",
    price: "$299",
    was: "$997",
    popular: false,
    tagline: "Full brand identity, done right.",
    priceId: null, // add price ID when ready
    features: [
      "Unlimited logo concepts",
      "8 designers assigned",
      "Unlimited revisions",
      "SVG, PNG, PDF, EPS files",
      "Stationery design included",
      "500 business cards printed",
      "Full brand kit & guidelines",
      "Priority 24-hour turnaround",
    ],
  },
];

export default function Pricing() {
  const { paddle, ready } = usePaddle();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  function handleBuy(plan: Plan) {
    console.log("[Paddle] handleBuy:", { priceId: plan.priceId, ready, paddle: !!paddle });
    if (plan.priceId && ready && paddle) {
      setLoadingPlan(plan.name);
      paddle.Checkout.open({
        items: [{ priceId: plan.priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          theme: "light",
        },
      });
      // Reset spinner after a short delay — Paddle takes over from here
      setTimeout(() => setLoadingPlan(null), 1500);
    } else {
      // Fallback to live chat for plans without a price ID yet
      openChat();
    }
  }

  return (
    <div id="pricing" className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No hidden fees. No surprises. Pick the plan that fits your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 scale-[1.02]"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-200" />
                    Most popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-7">
                <p
                  className={`text-xs font-semibold tracking-widest uppercase mb-1 ${
                    plan.popular ? "text-violet-400" : "text-gray-400"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className={`text-5xl font-bold tracking-tight ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm line-through ${
                      plan.popular ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {plan.was}
                  </span>
                </div>
                <p
                  className={`text-sm leading-snug ${
                    plan.popular ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.tagline}
                </p>
              </div>

              {/* Divider */}
              <div
                className={`border-t mb-7 ${
                  plan.popular ? "border-white/10" : "border-gray-100"
                }`}
              />

              {/* Features */}
              <ul className="flex-1 space-y-3.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${
                        plan.popular ? "text-violet-400" : "text-gray-400"
                      }`}
                    />
                    <span className={plan.popular ? "text-gray-300" : "text-gray-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleBuy(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.popular
                    ? "bg-white text-gray-900 hover:bg-gray-100 focus:ring-white"
                    : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900"
                }`}
              >
                {loadingPlan === plan.name ? "Opening…" : plan.priceId ? "Order now" : "Contact us"}
              </button>

              {plan.priceId && (
                <p className={`text-center text-xs mt-3 ${plan.popular ? "text-gray-500" : "text-gray-400"}`}>
                  Secure checkout via Paddle
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          All plans include a 100% money-back guarantee.
        </p>
      </div>
    </div>
  );
}
