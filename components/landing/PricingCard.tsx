"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const INCLUDES = [
  "8 logo variations (PNG + favicon)",
  "10 stationery files (business card, letterhead, invoice...)",
  "8 merchandise mockups (t-shirt, mug, tote bag...)",
  "13 social media templates (all platforms)",
  "6 signage & print files (billboard, storefront...)",
  "6 web & digital assets (hero, app screen, newsletter)",
  "4 brand documentation PDFs",
  "Organized ZIP — ready to use immediately",
  "Lifetime access — never expires",
];

export function PricingCard() {
  return (
    <div className="flex justify-center">
      <motion.div
        className="w-full max-w-lg relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-3xl blur-2xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 100%)" }}
        />

        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(12,12,20,0.9)",
            border: "1px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header gradient band */}
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 50%, #fb7185 100%)" }}
          />

          <div className="p-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
              }}>
              ✦ Most popular · No subscriptions ever
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-2">
              <div className="flex items-start">
                <span className="text-2xl font-bold text-white/60 mt-1">$</span>
                <span
                  className="text-8xl font-bold leading-none"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  29
                </span>
              </div>
              <div className="pb-3">
                <div className="text-white/60 text-sm">one-time</div>
                <div className="text-white/30 text-xs">lifetime access</div>
              </div>
            </div>

            <p className="text-white/50 text-sm mb-8">
              Generate a complete brand kit instantly. No designer needed.
            </p>

            {/* Includes list */}
            <div className="space-y-3 mb-8">
              {INCLUDES.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}
                  >
                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white/65 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/create" className="block">
              <motion.button
                className="w-full py-4 rounded-2xl text-base font-semibold text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                  boxShadow: "0 0 30px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 45px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Generate My Brand Kit →</span>
              </motion.button>
            </Link>

            <p className="text-center text-white/25 text-xs mt-4">
              Instant delivery · Secure payment via Stripe
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
