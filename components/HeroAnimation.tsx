"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BRAND_SHOWCASES = [
  {
    type: "business-card",
    label: "Business Card",
    bg: "from-violet-900/80 to-violet-800/60",
    accent: "#7c3aed",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-48 h-28 rounded-xl relative overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b69 100%)" }}>
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-violet-500/50 mb-2 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-violet-300 rounded-full border-r-transparent" />
              </div>
              <div className="h-2.5 w-20 bg-white/80 rounded-full mb-1" />
              <div className="h-1.5 w-14 bg-white/40 rounded-full" />
            </div>
            <div className="space-y-1">
              <div className="h-1 w-24 bg-violet-300/40 rounded-full" />
              <div className="h-1 w-20 bg-violet-300/30 rounded-full" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-cyan-500/10 -translate-y-8 translate-x-8" />
        </div>
      </div>
    ),
  },
  {
    type: "tshirt",
    label: "Merchandise",
    bg: "from-cyan-900/80 to-cyan-800/60",
    accent: "#06b6d4",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative w-40 h-44">
          {/* T-shirt silhouette */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(20% 0%, 30% 0%, 35% 15%, 50% 15%, 65% 15%, 70% 0%, 80% 0%, 100% 25%, 80% 30%, 80% 100%, 20% 100%, 20% 30%, 0% 25%)",
            background: "linear-gradient(180deg, #164e63 0%, #0e7490 100%)",
          }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-300/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-300 rounded-full border-r-transparent rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    type: "storefront",
    label: "Storefront Sign",
    bg: "from-slate-900/80 to-slate-800/60",
    accent: "#fb7185",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-52 h-36 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative"
          style={{ background: "linear-gradient(180deg, #1c1c2e 0%, #2d2d44 100%)" }}>
          {/* Store front */}
          <div className="absolute top-0 inset-x-0 h-12 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #fb7185 0%, #c026d3 100%)" }}>
            <div className="h-2 w-24 bg-white/80 rounded-full" />
          </div>
          <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-4 pb-2 px-4">
            <div className="w-12 h-20 rounded-t-xl bg-slate-700/60 border border-white/10 flex items-center justify-center">
              <div className="w-4 h-6 bg-yellow-300/30 rounded-sm" />
            </div>
            <div className="w-16 h-24 rounded-t-xl bg-slate-600/60 border border-white/10 flex items-center justify-center">
              <div className="w-6 h-8 bg-yellow-300/20 rounded-sm" />
            </div>
            <div className="w-12 h-20 rounded-t-xl bg-slate-700/60 border border-white/10 flex items-center justify-center">
              <div className="w-4 h-6 bg-yellow-300/30 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    type: "social",
    label: "Social Media",
    bg: "from-pink-900/80 to-pink-800/60",
    accent: "#ec4899",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(135deg, #831843 0%, #be185d 50%, #ec4899 100%)" }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center bg-white/10">
              <div className="w-5 h-5 border-2 border-white rounded-full border-r-transparent rotate-45" />
            </div>
            <div className="h-2 w-20 bg-white/70 rounded-full" />
            <div className="h-1.5 w-14 bg-white/40 rounded-full" />
            <div className="mt-1 px-4 py-1.5 rounded-full bg-white/20 border border-white/30">
              <div className="h-1.5 w-12 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    type: "menu",
    label: "Restaurant Menu",
    bg: "from-amber-900/80 to-amber-800/60",
    accent: "#f59e0b",
    content: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          style={{ background: "linear-gradient(180deg, #1c1007 0%, #2d1a0a 100%)" }}>
          <div className="p-3 h-full flex flex-col gap-2">
            <div className="h-6 w-full rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}>
              <div className="h-1.5 w-14 bg-white/70 rounded-full" />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-500/20 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-full bg-white/40 rounded-full" />
                  <div className="h-1 w-2/3 bg-white/20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export function HeroAnimation() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BRAND_SHOWCASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const showcase = BRAND_SHOWCASES[current];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main display card */}
      <div className="relative aspect-square rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 80px rgba(124,58,237,0.2), 0 0 120px rgba(6,182,212,0.1)",
        }}>

        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${showcase.accent}20 0%, transparent 60%)`,
          }}
        />

        {/* Asset type label */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <motion.div
            key={showcase.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            {showcase.label}
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showcase.type}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {showcase.content}
          </motion.div>
        </AnimatePresence>

        {/* Bottom progress dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {BRAND_SHOWCASES.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full cursor-pointer"
              animate={{
                width: i === current ? 20 : 4,
                background: i === current ? showcase.accent : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.3 }}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* Floating asset count pills */}
      <motion.div
        className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          color: "white",
          boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        60+ assets
      </motion.div>

      <motion.div
        className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
        }}
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        ⚡ 90 seconds
      </motion.div>
    </div>
  );
}
