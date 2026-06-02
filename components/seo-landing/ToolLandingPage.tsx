"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles, ChevronDown } from "lucide-react";

export interface ToolLandingConfig {
  headline: string;
  subheadline: string;
  badge: string;
  ctaLabel: string;
  heroFeatures: string[];
  outputFiles: { label: string; desc: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedTools: { label: string; href: string; desc: string }[];
}

export default function ToolLandingPage({ config }: { config: ToolLandingConfig }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            Crea<span style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Curve</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">All Free Tools</Link>
            <Link href="/logo-design" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Logo Design</Link>
            <Link href="/logo-prep" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              Try Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#7c3aed,transparent 70%)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 border border-violet-200 bg-violet-50 rounded-full px-3 py-1 mb-6">
              <Sparkles size={12} className="text-violet-500" />
              <span className="text-xs font-medium text-violet-700">{config.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-5">
              {config.headline}
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">{config.subheadline}</p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {config.heroFeatures.map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  <CheckCircle size={12} className="text-violet-500" /> {f}
                </span>
              ))}
            </div>

            <Link
              href="/logo-prep"
              className="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-violet-200"
              style={{ background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)" }}
            >
              <Sparkles size={16} />
              {config.ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <p className="mt-3 text-xs text-gray-400">First use free · No account required · Instant download</p>
          </motion.div>
        </div>
      </section>

      {/* Output files */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Everything included in your download</h2>
          <p className="text-gray-500 text-center mb-10">Not just one file — the full professional package</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.outputFiles.map((f) => (
              <div key={f.label} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <CheckCircle size={16} className="text-violet-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.howItWorks.map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>{s.step}</div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/logo-prep"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}
            >
              <Sparkles size={14} /> {config.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {config.faqs.map(({ q, a }) => (
              <details key={q} className="group border border-gray-100 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900">{q}</span>
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Other free tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.relatedTools.map((t) => (
              <Link key={t.href} href={t.href} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                <ArrowRight size={14} className="text-violet-400 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CreaCurve</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-gray-700 transition-colors">Refund</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
