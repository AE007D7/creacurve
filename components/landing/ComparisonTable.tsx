"use client";

import { motion } from "framer-motion";

const rows = [
  { feature: "Turnaround time", them: "3–10 business days", us: "90 seconds" },
  { feature: "Price", them: "$500–$5,000", us: "$29 one-time" },
  { feature: "Revisions", them: "1–3 rounds (extra cost)", us: "Regenerate anytime" },
  { feature: "Asset quantity", them: "10–20 files typical", us: "60+ assets" },
  { feature: "File formats", them: "Whatever they deliver", us: "SVG, PNG, PDF, ICO" },
  { feature: "Availability", them: "Business hours only", us: "24 / 7 / 365" },
  { feature: "Ownership", them: "Contract dependent", us: "100% yours, forever" },
  { feature: "Social media sized", them: "Add-on / extra cost", us: "Included" },
  { feature: "Brand guidelines PDF", them: "Expensive extra", us: "Included" },
  { feature: "Merchandise files", them: "Rarely included", us: "Included" },
];

const Check = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.4)" strokeWidth="1" />
    <path d="M6 10l2.5 2.5L14 7" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <path d="M7 7l6 6M13 7l-6 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function ComparisonTable() {
  return (
    <section className="w-full py-32 lg:py-40 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.18)", color: "#fda4af" }}
          >
            Why CreaCurve
          </div>
          <h2 className="font-bold tracking-tight text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.95]">
            CreaCurve vs Hiring a Designer
          </h2>
        </motion.div>

        {/* Table */}
        <motion.div
          className="rounded-3xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Column headers */}
          <div
            className="grid grid-cols-3 px-6 py-5"
            style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-white/30 text-sm font-medium">Feature</div>
            <div className="text-white/30 text-sm font-medium text-center">Hiring a Designer</div>
            <div className="text-center">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                CreaCurve ✦
              </span>
            </div>
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={row.feature}
              className="grid grid-cols-3 items-center px-6 py-4 group"
              style={{
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ background: "rgba(124,58,237,0.04)" }}
            >
              <div className="text-white/55 text-sm font-medium">{row.feature}</div>

              <div className="flex items-center justify-center gap-2">
                <Cross />
                <span className="text-white/25 text-sm hidden sm:block">{row.them}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Check />
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#67e8f9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {row.us}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
