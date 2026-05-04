"use client";

import { motion } from "framer-motion";
import { openChat } from "@/lib/chat";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const PLACEHOLDER_SEEDS = [
  "/logo-examples/logo-1.png",
  "/logo-examples/logo-2.png",
  "/logo-examples/logo-4.png",
  "/logo-examples/1.jpg",
  "/logo-examples/2.jpg",
  "/logo-examples/3.jpg",
];

const PARTNERS = [
  { name: "Stripe",  domain: "stripe.com"  },
  { name: "Notion",  domain: "notion.so"   },
  { name: "Linear",  domain: "linear.app"  },
  { name: "Vercel",  domain: "vercel.com"  },
  { name: "Figma",   domain: "figma.com"   },
  { name: "Shopify", domain: "shopify.com" },
];

export default function Hero() {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Subtle background orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 border border-violet-200 bg-violet-50 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-xs font-medium text-violet-700 tracking-wide">
                Professional Logo Design
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.04] mb-6">
              Logos that{" "}
              <span
                className="font-serif italic font-normal"
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                mean business.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-md leading-relaxed">
              Professional logo design from industry specialists. First concepts in 24–48 hours.
              Starting at{" "}
              <span className="font-semibold text-gray-900">$35</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openChat}
                className="bg-gray-900 text-white font-medium px-7 py-3.5 rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
              >
                Get started — it&apos;s free
              </button>
              <button
                onClick={() => scrollTo("portfolio")}
                className="border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
              >
                View work
              </button>
            </div>
          </motion.div>

          {/* Right column — 2×3 logo grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="relative grid grid-cols-3 gap-3"
          >
            {/* Rotating circular badge */}
            <div className="absolute -top-8 -right-6 w-20 h-20 z-10 hidden lg:block" aria-hidden="true">
              <svg viewBox="0 0 80 80" className="w-full h-full" style={{ animation: "spin 18s linear infinite" }}>
                <defs>
                  <path id="badge-circle" d="M 40,40 m -27,0 a 27,27 0 1,1 54,0 a 27,27 0 1,1 -54,0" />
                </defs>
                <text fontSize="7" fill="#7c3aed" fontWeight="600" letterSpacing="2" fontFamily="system-ui,sans-serif">
                  <textPath href="#badge-circle">PROFESSIONAL DESIGN • FAST DELIVERY •</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-violet-500 text-base font-bold select-none">✦</div>
            </div>
            {PLACEHOLDER_SEEDS.map((seed, i) => (
              <motion.div
                key={seed}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease: "easeOut" }}
                className="aspect-square border border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:shadow-md hover:scale-[1.03] transition-all duration-200"
              >
                <img
                  src={seed}
                  alt={`Logo design example ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
          className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6"
        >
          <span className="text-sm text-gray-400 font-medium whitespace-nowrap">
            Trusted by 2,000+ brands
          </span>
          <div className="flex flex-wrap items-center gap-7">
            {PARTNERS.map((p) => (
              <img
                key={p.name}
                src={`https://logo.clearbit.com/${p.domain}`}
                alt={p.name}
                width={80}
                height={24}
                className="h-6 w-auto object-contain opacity-30 hover:opacity-60 transition-opacity duration-200 grayscale"
                loading="lazy"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
