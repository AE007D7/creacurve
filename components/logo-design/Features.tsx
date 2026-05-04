"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, Shield, Zap, RefreshCw, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
}

const FEATURES: Feature[] = [
  {
    number: "01",
    icon: Sparkles,
    title: "Industry-specific designers",
    description: "Every project is matched to a designer who lives in your sector. A law firm and a food truck speak completely different visual languages — we speak both.",
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
  },
  {
    number: "02",
    icon: Zap,
    title: "First concepts in 24–48 hours",
    description: "No waiting weeks. Your designers start immediately and deliver initial concepts fast so you can react, refine, and move forward with confidence.",
    accent: "text-sky-600",
    accentBg: "bg-sky-50",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "Unlimited revisions",
    description: "We iterate until it's exactly right. On Professional and Platinum, there's no limit — we stay in the loop as long as you need.",
    accent: "text-rose-600",
    accentBg: "bg-rose-50",
  },
  {
    number: "04",
    icon: Award,
    title: "10+ years of senior experience",
    description: "Not junior outsourcing. Senior designers with track records across every market, every format, every scale.",
    accent: "text-amber-600",
    accentBg: "bg-amber-50",
  },
  {
    number: "05",
    icon: Shield,
    title: "Transparent, fixed pricing",
    description: "What you see is what you pay. No scope creep, no hidden agency fees, no surprises on the final invoice.",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
  },
  {
    number: "06",
    icon: BadgeCheck,
    title: "100% money-back guarantee",
    description: "If you're not satisfied with the work, you get a full refund. No forms, no waiting, no questions.",
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">

        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-20 items-end">
          <div>
            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">
              Why CreaCurve
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              The standard<br />
              <span
                className="font-serif italic font-normal"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
              >
                every brand deserves.
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl lg:mb-1">
            Most logo services give you a template with a new font. We give you a designer
            who understands your market, your audience, and what it takes to stand out in it.
          </p>
        </div>

        {/* Feature list — numbered rows */}
        <div className="divide-y divide-gray-100">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
                className="group grid grid-cols-[3rem_1fr] md:grid-cols-[3rem_1fr_1.5fr] gap-x-8 gap-y-2 py-8 hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors duration-200 cursor-default"
              >
                {/* Number */}
                <span className="text-xs font-mono font-semibold text-gray-300 pt-1 tracking-widest">
                  {f.number}
                </span>

                {/* Title + icon */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg ${f.accentBg} flex items-center justify-center`}>
                    <Icon size={15} className={f.accent} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 leading-snug pt-1">
                    {f.title}
                  </h3>
                </div>

                {/* Description — hidden on mobile, shows in 3rd col on md+ */}
                <p className="col-start-2 md:col-start-3 text-sm text-gray-500 leading-relaxed md:pt-1">
                  {f.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
