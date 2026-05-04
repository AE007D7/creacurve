"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const ASSETS = [
  { label: "Business Card", w: 180, h: 100, color: "#7c3aed", icon: "💳", angle: -8, x: -30, y: -60, z: 3 },
  { label: "Social Post", w: 140, h: 140, color: "#06b6d4", icon: "📸", angle: 6, x: 100, y: -90, z: 2 },
  { label: "Brand Guide", w: 150, h: 195, color: "#fb7185", icon: "📖", angle: -4, x: -80, y: 60, z: 1 },
  { label: "Letterhead", w: 160, h: 200, color: "#f59e0b", icon: "📄", angle: 5, x: 80, y: 80, z: 2 },
  { label: "T-Shirt", w: 130, h: 140, color: "#10b981", icon: "👕", angle: -6, x: 10, y: 160, z: 3 },
  { label: "App Icon", w: 90, h: 90, color: "#a78bfa", icon: "📱", angle: 4, x: 180, y: 20, z: 4 },
];

export function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [8, -8]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-8, 8]), { stiffness: 120, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[560px] aspect-square flex items-center justify-center"
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)" }} />

      <motion.div
        className="relative w-[360px] h-[360px]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Center logo placeholder */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl flex items-center justify-center z-10"
          style={{
            background: "rgba(15,15,15,0.9)",
            border: "1px solid rgba(124,58,237,0.4)",
            boxShadow: "0 0 30px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-3xl">✦</span>
        </motion.div>

        {ASSETS.map((asset, i) => (
          <motion.div
            key={asset.label}
            className="absolute rounded-2xl flex flex-col items-center justify-center gap-2 cursor-default select-none"
            style={{
              width: asset.w,
              height: asset.h,
              top: "50%",
              left: "50%",
              marginLeft: asset.x - asset.w / 2,
              marginTop: asset.y - asset.h / 2,
              background: `rgba(12,12,18,0.88)`,
              border: `1px solid ${asset.color}22`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
              backdropFilter: "blur(12px)",
              rotate: asset.angle,
              zIndex: asset.z,
            }}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{
              scale: 1.08,
              zIndex: 20,
              borderColor: `${asset.color}55`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${asset.color}22`,
              transition: { duration: 0.2 },
            }}
          >
            {/* Color bar top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${asset.color}, transparent)` }} />

            <span className="text-2xl">{asset.icon}</span>
            <span className="text-xs text-white/40 font-medium tracking-wide">{asset.label}</span>

            {/* Shimmer lines */}
            <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
              <div className="h-1 rounded-full" style={{ background: `${asset.color}18`, width: "70%" }} />
              <div className="h-1 rounded-full" style={{ background: `${asset.color}10`, width: "50%" }} />
            </div>
          </motion.div>
        ))}

        {/* Floating orbits */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "1px dashed rgba(124,58,237,0.08)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(124,58,237,0.6)",
            top: "50%", left: "50%",
            offsetPath: "path('M 0,-160 A 160,160 0 1,1 -0.01,-160')",
          }}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Asset count badge */}
      <motion.div
        className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-xs font-semibold"
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.25)",
          color: "#a78bfa",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        60+ assets included
      </motion.div>
    </div>
  );
}
