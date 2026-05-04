"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CreaCurveLogo } from "@/components/CreaCurveLogo";
import { HeroShowcase } from "./HeroShowcase";
import { BentoSection } from "./BentoSection";
import { BigNumbers } from "./BigNumbers";
import { ComparisonTable } from "./ComparisonTable";
import { FAQ } from "./FAQ";
import { Testimonials } from "./Testimonials";

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <CreaCurveLogo size={34} showText />

      <div className="hidden md:flex items-center gap-10">
        {[["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([l, h]) => (
          <a key={l} href={h} className="text-sm text-white/45 hover:text-white transition-colors duration-200 tracking-wide">
            {l}
          </a>
        ))}
      </div>

      <Link href="/create">
        <motion.button
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            boxShadow: "0 0 24px rgba(124,58,237,0.35)",
          }}
          whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(124,58,237,0.55)" }}
          whileTap={{ scale: 0.97 }}
        >
          Start for $29 →
        </motion.button>
      </Link>
    </motion.nav>
  );
}

/* ─── Ambient background ─────────────────────────────────────────────── */
function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100" />

      {/* Top-left violet orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900, height: 900,
          background: "radial-gradient(circle,rgba(124,58,237,0.13) 0%,transparent 70%)",
          top: -300, left: -200,
        }}
        animate={{ x: [0, 80, 20, -40, 0], y: [0, 60, 140, 80, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-right cyan orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 800, height: 800,
          background: "radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)",
          bottom: -250, right: -200,
        }}
        animate={{ x: [0, -70, -120, -50, 0], y: [0, -60, 40, -80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center coral micro-orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle,rgba(251,113,133,0.05) 0%,transparent 70%)",
          top: "40%", left: "50%", translateX: "-50%", translateY: "-50%",
        }}
        animate={{ scale: [1, 1.3, 0.9, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative w-full min-h-[95vh] flex items-center pt-24 pb-16 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-10"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.22)",
              color: "#a78bfa",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Powered by Claude AI · 100% automated
          </motion.div>

          {/* Headline */}
          <h1 className="font-bold tracking-tight leading-[0.92] mb-8 text-[clamp(3.2rem,6vw,6rem)]">
            From logo to{" "}
            <span
              className="font-serif italic"
              style={{
                background: "linear-gradient(135deg,#7c3aed 0%,#06b6d4 60%,#fb7185 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              launch-ready
            </span>
            <br />
            in 90 seconds.
          </h1>

          <p className="text-lg md:text-xl text-white/50 leading-relaxed mb-12 max-w-[520px]">
            Upload your logo. Receive{" "}
            <span className="text-white/85 font-medium">60+ brand assets</span> — business cards,
            social media, merchandise, signage, and more.
            {" "}<span className="text-white/85 font-medium">One payment, forever yours.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link href="/create">
              <motion.button
                className="group relative px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#7c3aed 0%,#06b6d4 100%)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 60px rgba(124,58,237,0.55),0 0 100px rgba(6,182,212,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Generate My Brand Kit — $29 →</span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%", skewX: -15 }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                className="px-8 py-4 rounded-2xl text-base font-medium text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
                whileHover={{ background: "rgba(255,255,255,0.07)" }}
                whileTap={{ scale: 0.98 }}
              >
                See what&apos;s included ↓
              </motion.button>
            </a>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#7c3aed","#06b6d4","#fb7185","#f59e0b","#10b981"].map((c,i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a]" style={{ background: c }} />
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold">2,400+ brands</div>
                <div className="text-xs text-white/35">crafted this month</div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_,i) => (
                <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <span className="text-white/40 text-sm ml-1">4.9 / 5</span>
            </div>
          </div>
        </motion.div>

        {/* Right — showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <HeroShowcase />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Full-bleed divider ─────────────────────────────────────────────── */
function GradientDivider() {
  return (
    <div className="w-full h-px" style={{
      background: "linear-gradient(90deg,transparent 0%,rgba(124,58,237,0.4) 30%,rgba(6,182,212,0.4) 70%,transparent 100%)"
    }} />
  );
}

/* ─── Process timeline ───────────────────────────────────────────────── */
function ProcessSection() {
  const steps = [
    {
      n: "01",
      icon: "↑",
      title: "Upload your logo",
      body: "PNG, SVG, or JPG — any format. We handle the rest.",
      color: "#7c3aed",
      detail: "Claude vision reads colors, style, personality & industry.",
    },
    {
      n: "02",
      icon: "$",
      title: "Pay once — $29",
      body: "One payment. No subscriptions, no upsells. Your brand kit is yours forever.",
      color: "#06b6d4",
      detail: "Secured by Stripe. Payment triggers the generation pipeline.",
    },
    {
      n: "03",
      icon: "↓",
      title: "Receive everything",
      body: "60+ assets delivered in under 90 seconds, organized and ready.",
      color: "#fb7185",
      detail: "Download as ZIP or browse in your dashboard. Email included.",
    },
  ];

  return (
    <section className="w-full py-32 lg:py-40 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.18)", color: "#fda4af" }}>
            How it works
          </div>
          <h2 className="font-bold tracking-tight text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.95]">
            Three steps to a complete brand.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.3) 20%,rgba(6,182,212,0.3) 80%,transparent)" }} />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -5, borderColor: `${s.color}30`, boxShadow: `0 20px 60px ${s.color}10` }}
            >
              <div className="text-xs font-mono font-semibold mb-6" style={{ color: `${s.color}60` }}>{s.n}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mb-6"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <h3 className="font-semibold text-white text-xl mb-3">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-5">{s.body}</p>
              <div className="text-xs text-white/30 px-3 py-2 rounded-xl"
                style={{ background: `${s.color}07`, border: `1px solid ${s.color}10` }}>
                {s.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────────────────── */
function PricingSection() {
  const included = [
    "8 logo variations (all formats + favicon set)",
    "10 stationery files — business card, letterhead, invoice...",
    "13 social media templates — every major platform",
    "8 merchandise mockups — t-shirt, mug, tote bag...",
    "6 signage & print files — billboard, storefront...",
    "6 web & digital assets — hero, app screen, newsletter",
    "4 packaging designs — box, bag, labels",
    "4 brand documentation PDFs",
    "Organized ZIP — ready to use immediately",
    "Lifetime access — never expires",
  ];

  return (
    <section id="pricing" className="w-full py-32 lg:py-40 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bold tracking-tight text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.95] mb-4">
            Simple, honest pricing.
          </h2>
          <p className="text-white/40 text-lg">No subscriptions. No tiers. No surprises.</p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            className="w-full max-w-xl relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-60"
              style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.2))" }} />

            <div className="relative rounded-3xl overflow-hidden"
              style={{ background: "rgba(12,12,18,0.95)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <div className="h-1" style={{ background: "linear-gradient(90deg,#7c3aed,#06b6d4,#fb7185)" }} />
              <div className="p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                  ✦ One-time payment · lifetime access
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-white/50 mt-2">$</span>
                  <span className="text-[7rem] font-bold leading-none tracking-tight"
                    style={{ background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.75))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    29
                  </span>
                  <div className="pb-4 text-white/40 text-sm">one-time<br/>forever</div>
                </div>
                <p className="text-white/40 text-sm mb-8">Complete brand kit. Generated in 90 seconds.</p>

                <div className="space-y-3 mb-10">
                  {included.map((item, i) => (
                    <motion.div key={i} className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                        style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.35)" }}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white/55 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <Link href="/create" className="block">
                  <motion.button
                    className="w-full py-4 rounded-2xl text-base font-semibold text-white relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                      boxShadow: "0 0 35px rgba(124,58,237,0.4)",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 55px rgba(124,58,237,0.55)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate My Brand Kit →
                  </motion.button>
                </Link>
                <p className="text-center text-white/20 text-xs mt-4">Secure checkout · Instant delivery · 30-day guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="w-full relative overflow-hidden py-40 px-6 md:px-12">
      {/* Full-bleed gradient background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.2) 0%,rgba(6,182,212,0.15) 50%,rgba(251,113,133,0.1) 100%)" }} />
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(10,10,10,0.6) 100%)" }} />

      <motion.div
        className="relative z-10 max-w-[900px] mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-bold tracking-tight text-[clamp(3rem,6vw,6rem)] leading-[0.9] mb-8">
          Your brand,{" "}
          <span className="font-serif italic"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            fully formed.
          </span>
        </h2>
        <p className="text-white/50 text-xl mb-12 max-w-xl mx-auto">
          Join thousands of founders and designers who launched with CreaCurve.
        </p>
        <Link href="/create">
          <motion.button
            className="px-12 py-5 rounded-2xl text-lg font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
              boxShadow: "0 0 50px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 80px rgba(124,58,237,0.6)" }}
            whileTap={{ scale: 0.97 }}
          >
            Generate My Brand Kit — $29 →
          </motion.button>
        </Link>
        <p className="text-white/25 text-sm mt-5">One-time · Lifetime access · 60+ assets</p>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-14 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <CreaCurveLogo size={28} showText />
        <div className="flex items-center gap-8 text-sm text-white/30">
          <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="mailto:hello@creacurve.com" className="hover:text-white/60 transition-colors">Contact</a>
        </div>
        <div className="text-xs text-white/20">
          Built with <span style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Claude AI</span> · © 2025 CreaCurve
        </div>
      </div>
    </footer>
  );
}

/* ─── Main export ────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] relative">
      <AmbientBackground />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <GradientDivider />
        <BigNumbers />
        <GradientDivider />
        <div id="features">
          <BentoSection />
        </div>
        <ProcessSection />
        <GradientDivider />
        <ComparisonTable />
        <Testimonials />
        <PricingSection />
        <FinalCTA />
        <section id="faq" className="w-full py-32 px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="max-w-[800px] mx-auto">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-bold tracking-tight text-5xl mb-4">Questions?</h2>
              <p className="text-white/40">Everything you need to know.</p>
            </motion.div>
            <FAQ />
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
