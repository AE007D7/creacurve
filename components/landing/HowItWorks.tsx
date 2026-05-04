"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "↑",
    title: "Upload Your Logo",
    description: "Drop your PNG, SVG, or JPG logo. We accept any format up to 5MB.",
    color: "#7c3aed",
    detail: "Claude analyzes colors, style, personality & industry from your logo.",
  },
  {
    number: "02",
    icon: "✦",
    title: "Pay Once — $29",
    description: "One simple payment. No subscriptions, ever. Your brand kit lasts forever.",
    color: "#06b6d4",
    detail: "Secured by Stripe. Your payment kicks off the automated generation pipeline.",
  },
  {
    number: "03",
    icon: "↓",
    title: "Receive Everything",
    description: "60+ assets arrive in 90 seconds, organized and ready to use.",
    color: "#fb7185",
    detail: "Download as a ZIP or browse in your dashboard. Email delivery included.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: "rgba(251,113,133,0.1)",
            border: "1px solid rgba(251,113,133,0.2)",
            color: "#fda4af",
          }}>
          How it works
        </div>
        <h2 className="font-bold tracking-tight text-4xl sm:text-5xl text-white mb-4 leading-tight">
          Three steps to a{" "}
          <em className="not-italic" style={{
            background: "linear-gradient(135deg, #fb7185, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>complete brand.</em>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 relative">
        {/* Connection line */}
        <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3) 20%, rgba(6,182,212,0.3) 50%, rgba(251,113,133,0.3) 80%, transparent)" }} />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ y: -4, borderColor: `${step.color}30` }}
          >
            {/* Number */}
            <div className="text-xs font-mono font-semibold mb-4"
              style={{ color: `${step.color}80` }}>
              {step.number}
            </div>

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold mb-5"
              style={{
                background: `${step.color}15`,
                border: `1px solid ${step.color}25`,
                color: step.color,
              }}
            >
              {step.icon}
            </div>

            <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{step.description}</p>

            <div
              className="text-xs leading-relaxed px-3 py-2 rounded-lg"
              style={{
                background: `${step.color}08`,
                color: "rgba(255,255,255,0.4)",
                border: `1px solid ${step.color}12`,
              }}
            >
              {step.detail}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
