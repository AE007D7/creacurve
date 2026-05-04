"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "60+",
    label: "Brand assets",
    sub: "logos, stationery, social, merch, signage & more",
    color: "#7c3aed",
  },
  {
    value: "90s",
    label: "Delivery time",
    sub: "from payment to full download in under 2 minutes",
    color: "#06b6d4",
  },
  {
    value: "$29",
    label: "One-time",
    sub: "no subscriptions, no hidden fees, yours forever",
    color: "#fb7185",
  },
];

export function BigNumbers() {
  return (
    <section className="w-full py-28 lg:py-36 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">

          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              className="relative flex flex-col items-start px-10 py-12 group"
              style={{
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 30% 50%, ${s.color}08 0%, transparent 70%)` }}
              />

              {/* Big number */}
              <motion.div
                className="font-bold tracking-tighter leading-none mb-4"
                style={{
                  fontSize: "clamp(5rem,10vw,9rem)",
                  background: `linear-gradient(135deg, ${s.color} 0%, rgba(255,255,255,0.7) 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0, 0, 0.2, 1] }}
              >
                {s.value}
              </motion.div>

              {/* Label */}
              <div className="text-white font-semibold text-xl mb-2">{s.label}</div>
              <div className="text-white/35 text-sm leading-relaxed max-w-[220px]">{s.sub}</div>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-10 h-px"
                style={{ background: `linear-gradient(90deg, ${s.color}50, transparent)` }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
