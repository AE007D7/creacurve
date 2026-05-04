"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "How does CreaCurve generate 60+ assets so fast?",
    a: "CreaCurve uses Claude AI with vision to analyze your logo — detecting colors, style, industry, and personality. It then runs 6 parallel generation workers, each creating professional HTML/CSS mockups which are rendered to high-resolution PNGs using Browserless. The whole pipeline completes in under 90 seconds.",
  },
  {
    q: "What file formats do I receive?",
    a: "All assets are delivered as high-resolution PNGs organized in a ZIP file. Logo variations include original, white, black, monochrome versions. Brand documentation is delivered as multi-page PDFs. Everything is print-ready and web-optimized.",
  },
  {
    q: "Can I use the assets commercially?",
    a: "Yes. Once you pay the $29 fee, you own the generated assets outright. Use them for your business, clients, or any commercial purpose. The only restriction is you cannot resell the CreaCurve service itself.",
  },
  {
    q: "What if I don't like the results?",
    a: "Every asset includes a free regeneration option in your dashboard. If the first pass doesn't match your vision, click 'Regenerate' on any asset and Claude will create a new version. We also offer a 30-day money-back guarantee if you're not satisfied.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account required to purchase. You'll receive your assets via email and can access your dashboard with the link we send you. Optionally create an account to manage multiple brand kits.",
  },
  {
    q: "What logo formats are accepted?",
    a: "We accept PNG, JPG, SVG, and WebP files up to 5MB. For best results, use a high-contrast PNG with a transparent background. The AI works with any quality logo, but cleaner inputs produce better outputs.",
  },
  {
    q: "How long do I have access to my files?",
    a: "Forever. Your dashboard link never expires and your files are stored permanently. The ZIP download link is valid for 7 days but you can regenerate it anytime from your dashboard.",
  },
  {
    q: "Is this built on top of image generation AI?",
    a: "No. CreaCurve uses Claude's intelligence to write HTML/CSS code that renders into professional-grade images — not image generation models. This produces more consistent, brand-accurate results than diffusion models.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <motion.div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{
            background: open === i ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.025)",
            border: open === i ? "1px solid rgba(124,58,237,0.2)" : "1px solid rgba(255,255,255,0.07)",
          }}
          animate={{}}
          transition={{ duration: 0.2 }}
        >
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-white/85 text-sm font-medium">{faq.q}</span>
            <motion.span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                background: open === i ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)",
                color: open === i ? "#a78bfa" : "rgba(255,255,255,0.4)",
              }}
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              +
            </motion.span>
          </button>

          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
