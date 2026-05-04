"use client";

import { motion } from "framer-motion";

interface CreaCurveLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export function CreaCurveLogo({
  size = 40,
  showText = true,
  className = "",
  animated = false,
}: CreaCurveLogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* The flowing curve forming a C that morphs into a wave */}
      <motion.path
        d="M32 8C26 8 18 10 13 16C8 22 8 28 12 32C16 36 22 36 27 33"
        stroke="url(#logoGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Inner wave element */}
      <motion.path
        d="M14 20C17 17 21 16 25 18C29 20 31 24 28 27"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
        initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animated ? { pathLength: 1, opacity: 0.7 } : undefined}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      />
      {/* Dot accent */}
      <motion.circle
        cx="32"
        cy="8"
        r="2.5"
        fill="url(#logoGrad)"
        initial={animated ? { scale: 0, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: 1.0 }}
      />
    </svg>
  );

  if (!showText) {
    return (
      <div className={className}>
        {animated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {mark}
          </motion.div>
        ) : (
          mark
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {mark}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: size * 0.5,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #fafafa 40%, rgba(250,250,250,0.7) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        CreaCurve
      </span>
    </div>
  );
}
