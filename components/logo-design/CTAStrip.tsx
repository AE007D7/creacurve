"use client";

import { motion } from "framer-motion";
import { openChat } from "@/lib/chat";

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
              onClick={openChat}
              className="bg-white text-gray-900 font-semibold px-9 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
            >
              Start your project
            </button>
            <a
              href="https://wa.me/12522198026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-semibold px-9 py-4 rounded-xl text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
              style={{ background: "#25D366" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
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
