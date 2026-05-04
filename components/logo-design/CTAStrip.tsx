"use client";

import { motion } from "framer-motion";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function CTAStrip() {
  return (
    <section className="relative py-32 bg-gray-900 overflow-hidden">
      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.15]"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 65%)" }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-5">
            Get started today
          </p>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.02]">
            Ready to build{" "}
            <br className="hidden md:block" />
            <span
              className="font-serif italic font-normal"
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                background: "linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              your brand?
            </span>
          </h2>

          <p className="text-lg text-gray-400 mb-12 max-w-md mx-auto">
            Join 2,000+ brands who trust CreaCurve to make their first impression count.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("lead-form")}
              className="bg-white text-gray-900 font-semibold px-9 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
            >
              Start your project
            </button>
            <a
              href="tel:+18001234567"
              className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
            >
              or call +1 (800) 123-4567
            </a>
          </div>

          {/* Trust row */}
          <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
            {["Free consultation", "Reply in 24h", "100% money-back"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1 h-1 rounded-full bg-violet-500" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
