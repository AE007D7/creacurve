"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreaCurveLogo } from "./CreaCurveLogo";
import type { Project, Asset, BrandData } from "@/lib/types";

const MESSAGES = [
  "Reading your brand DNA...",
  "Analyzing colors and personality...",
  "Designing your business card...",
  "Crafting your letterhead...",
  "Building your social media kit...",
  "Creating merchandise mockups...",
  "Generating storefront signage...",
  "Writing your brand guidelines...",
  "Packaging your brand kit...",
  "Almost there — final touches...",
];

function ProgressRing({ progress, size = 200 }: { progress: number; size?: number }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#pg)" strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={Math.floor(progress / 5)}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold tabular-nums"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {progress}%
        </motion.span>
        <span className="text-white/30 text-xs mt-1">generating</span>
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ["#7c3aed", "#06b6d4", "#fb7185", "#f59e0b", "#fafafa"];
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {[...Array(70)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: 6 + Math.random() * 6,
            height: 6 + Math.random() * 6,
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{ y: "110vh", x: (Math.random() - 0.5) * 300, rotate: Math.random() * 720, opacity: [1, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.2, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export function ProcessingPage({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "1";

  const [project, setProject] = useState<Project | null>(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const doneRef = useRef(false);

  // Rotate messages
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  // Poll project status every 2 seconds
  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const data: Project = await res.json();
        if (!active) return;

        setProject(data);

        if (data.status === "complete" && !doneRef.current) {
          doneRef.current = true;
          setShowConfetti(true);
          setTimeout(() => router.push(`/dashboard/${projectId}`), 3200);
        } else if (data.status === "failed") {
          doneRef.current = true;
        }
      } catch {
        // keep polling
      }
    };

    poll();
    const interval = setInterval(poll, 2000);
    return () => { active = false; clearInterval(interval); };
  }, [projectId, router]);

  // Try Supabase realtime if configured (enhancement, not required)
  useEffect(() => {
    if (isDevMode) return;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || supabaseUrl.includes("your-project") || !supabaseKey) return;

    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      const ch = supabase.channel(`project:${projectId}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "projects", filter: `id=eq.${projectId}` },
          (payload) => setProject(payload.new as Project)
        ).subscribe();
      return () => { supabase.removeChannel(ch); };
    }).catch(() => {});
  }, [projectId, isDevMode]);

  const brandData = project?.brand_data as BrandData | null;
  const progress = project?.progress ?? 0;
  const failed = project?.status === "failed";

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a]">
      {showConfetti && <Confetti />}

      {/* Complete overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-4xl font-bold text-white mb-2">Your brand is ready.</h2>
              <p className="text-white/40 text-lg">Redirecting to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute inset-x-0 top-0 h-[60vh]"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.12) 0%, transparent 60%)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <CreaCurveLogo size={32} showText />
        <span className="text-xs text-white/25 font-mono">{project?.brand_name || "Your Brand"}</span>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main: progress + asset grid */}
          <div className="lg:col-span-2 flex flex-col items-center">

            {/* Progress ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6"
            >
              <ProgressRing progress={progress} size={200} />
            </motion.div>

            {/* Message */}
            <div className="h-7 mb-10 text-center">
              {failed ? (
                <p className="text-red-400 text-sm">Generation failed. Please try again.</p>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIdx}
                    className="text-white/50 text-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {MESSAGES[msgIdx]}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>

            {/* Step tracker */}
            <div className="w-full max-w-md mb-10">
              {[
                { label: "Brand analysis", done: progress >= 15, active: progress < 15 && progress >= 5 },
                { label: "Generating assets", done: progress >= 90, active: progress >= 15 && progress < 90 },
                { label: "Building ZIP package", done: progress >= 97, active: progress >= 90 && progress < 97 },
                { label: "Sending email", done: progress >= 100, active: progress >= 97 && progress < 100 },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    step.done
                      ? "bg-violet-500 text-white"
                      : step.active
                      ? "border-2 border-violet-500"
                      : "border border-white/10"
                  }`}>
                    {step.done ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 10">
                        <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : step.active ? (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-violet-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : null}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${step.done ? "text-white/60 line-through" : step.active ? "text-white" : "text-white/25"}`}>
                    {step.label}
                  </span>
                  {step.active && (
                    <motion.span
                      className="ml-auto text-xs text-violet-400"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      running
                    </motion.span>
                  )}
                </div>
              ))}
            </div>

            {isDevMode && (
              <div className="px-4 py-2 rounded-xl text-xs text-amber-400/70 mb-6"
                style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}>
                Dev mode — add API keys to .env.local for full generation
              </div>
            )}
          </div>

          {/* Sidebar: brand DNA */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/25 uppercase tracking-widest">Brand DNA</p>

            <AnimatePresence>
              {brandData ? (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl p-5 space-y-5"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* Colors */}
                  <div>
                    <p className="text-white/35 text-xs mb-3">Color palette</p>
                    <div className="flex flex-wrap gap-2">
                      {[...brandData.primaryColors, ...brandData.secondaryColors, ...brandData.accentColors]
                        .slice(0, 5)
                        .map((c, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.06, type: "spring" }}
                            className="flex flex-col items-center gap-1"
                          >
                            <div className="w-9 h-9 rounded-lg border border-white/10" style={{ background: c.hex }} title={c.name} />
                            <span className="text-[9px] text-white/30 font-mono">{c.hex}</span>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Style & personality */}
                  <div>
                    <p className="text-white/35 text-xs mb-2">Style</p>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                      {brandData.style}
                    </span>
                  </div>

                  <div>
                    <p className="text-white/35 text-xs mb-2">Personality</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brandData.personality.map((t, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.15)", color: "#67e8f9" }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {brandData.taglineSuggestions?.[0] && (
                    <div>
                      <p className="text-white/35 text-xs mb-1.5">Tagline</p>
                      <p className="text-white/70 text-sm italic">"{brandData.taglineSuggestions[0]}"</p>
                    </div>
                  )}

                  {brandData.fontPairings?.[0] && (
                    <div>
                      <p className="text-white/35 text-xs mb-1.5">Typography</p>
                      <p className="text-white/60 text-xs">{brandData.fontPairings[0].heading} / {brandData.fontPairings[0].body}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="skeleton"
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[80, 60, 90, 50, 70].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-3 rounded-lg"
                      style={{ width: `${w}%`, background: "rgba(255,255,255,0.05)" }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                  <p className="text-white/20 text-xs pt-1">Analyzing your logo...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live status badge */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)" }}>
              <motion.div
                className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-white/50 text-xs">
                {progress >= 100 ? "Brand kit complete!" :
                 progress >= 90 ? "Packaging your ZIP..." :
                 progress >= 15 ? "Generating assets..." :
                 "Analyzing logo..."}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
