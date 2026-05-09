"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Download, CheckCircle, Loader2, ImageIcon, X, Sparkles, ChevronDown, FileText,
} from "lucide-react";
import Link from "next/link";

// ── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        scrolled ? "border-b border-gray-200 shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Crea
            <span
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Curve
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/logo-design" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Logo Design
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Legal <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <Link href="/terms"   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of Service</Link>
              <Link href="/privacy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy Policy</Link>
              <Link href="/refund"  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Refund Policy</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type State =
  | { phase: "idle" }
  | { phase: "preview"; file: File; previewUrl: string }
  | { phase: "processing" }
  | { phase: "done"; zipUrl: string; fileName: string };

const OUTPUT_FILES = [
  { label: "logo-transparent.png", desc: "No background — place on anything",      badge: "bg-violet-50  border-violet-200 text-violet-700"  },
  { label: "logo-black.png",        desc: "Black silhouette on transparent",         badge: "bg-gray-50   border-gray-200   text-gray-700"    },
  { label: "logo-white.png",        desc: "White silhouette on transparent",         badge: "bg-slate-50  border-slate-200  text-slate-600"   },
  { label: "logo-on-white.png",     desc: "Full color on white background",          badge: "bg-orange-50 border-orange-200 text-orange-700"  },
  { label: "logo-on-dark.png",      desc: "Full color on dark background",           badge: "bg-indigo-50 border-indigo-200 text-indigo-700"  },
  { label: "brand-guidelines.pdf",  desc: "Colors, typography & usage rules",        badge: "bg-rose-50   border-rose-200   text-rose-700",  icon: "pdf" },
];

const STEPS = ["Remove BG", "Variants", "Brand PDF", "Pack ZIP"];

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LogoPrepPage() {
  const [state, setState]       = useState<State>({ phase: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const [brandName, setBrandName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    setState({ phase: "preview", file, previewUrl });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => {
    if (state.phase === "preview") URL.revokeObjectURL(state.previewUrl);
    if (state.phase === "done")    URL.revokeObjectURL(state.zipUrl);
    setState({ phase: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  };

  const process = async () => {
    if (state.phase !== "preview") return;
    const { file } = state;
    URL.revokeObjectURL(state.previewUrl);
    setState({ phase: "processing" });

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("brandName", brandName || "My Brand");
      const res = await fetch("/api/logo-prep", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(err.error || "Processing failed. Please try again.");
        setState({ phase: "idle" });
        return;
      }
      const blob = await res.blob();
      const zipUrl = URL.createObjectURL(blob);
      const safeName = (brandName || "logo").replace(/\s+/g, "-").toLowerCase();
      setState({ phase: "done", zipUrl, fileName: `${safeName}-files.zip` });
    } catch {
      alert("Network error. Please try again.");
      setState({ phase: "idle" });
    }
  };

  const download = () => {
    if (state.phase !== "done") return;
    const a = document.createElement("a");
    a.href = state.zipUrl;
    a.download = state.fileName;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* ── Hero ── */}
      <section className="relative py-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 border border-violet-200 bg-violet-50 rounded-full px-3 py-1 mb-6">
              <Sparkles size={12} className="text-violet-500" />
              <span className="text-xs font-medium text-violet-700 tracking-wide">Free Logo Prep Tool</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-5">
              Upload your logo.{" "}
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Get every version.
              </span>
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
              Upload your AI-generated logo and instantly get 5 PNG variants plus a full{" "}
              <span className="font-medium text-gray-700">Brand Guidelines PDF</span> — all in one ZIP, ready for web and print.
            </p>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence mode="wait">

              {/* IDLE */}
              {state.phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Brand name input */}
                  <div className="mb-4 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Brand name <span className="text-gray-400 font-normal">(used in the PDF)</span>
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Acme Studio"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-violet-400 bg-violet-50"
                        : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/40"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <Upload size={24} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900 mb-1">Drop your logo here</p>
                        <p className="text-sm text-gray-400">
                          or <span className="text-violet-600 font-medium">click to browse</span> — JPEG, PNG, WebP
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PREVIEW */}
              {state.phase === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  <div
                    className="relative flex items-center justify-center p-8"
                    style={{
                      backgroundImage: "linear-gradient(45deg,#f0f0f0 25%,transparent 25%),linear-gradient(-45deg,#f0f0f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f0f0f0 75%),linear-gradient(-45deg,transparent 75%,#f0f0f0 75%)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0,0 10px,10px -10px,-10px 0px",
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <img src={state.previewUrl} alt="Logo preview" className="max-h-48 max-w-full object-contain" />
                  </div>
                  <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate max-w-[180px]">{state.file.name}</span>
                      <span className="text-xs text-gray-400">({(state.file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      onClick={process}
                      className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
                    >
                      <Sparkles size={14} />
                      Generate all files
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PROCESSING */}
              {state.phase === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl p-12 bg-white"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 animate-spin" />
                      <Sparkles size={20} className="absolute inset-0 m-auto text-violet-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 mb-1">Processing your logo…</p>
                      <p className="text-sm text-gray-400">This takes about 10–20 seconds</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 mt-1">
                      {STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1.5">
                          <div className="w-9 h-9 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                            <Loader2 size={14} className="text-violet-500 animate-spin" style={{ animationDelay: `${i * 0.25}s` }} />
                          </div>
                          <span className="text-xs text-gray-400">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DONE */}
              {state.phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  <div className="p-8 flex flex-col items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 mb-1">Your files are ready!</p>
                      <p className="text-sm text-gray-500">ZIP contains 5 PNG variants + a Brand Guidelines PDF</p>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {OUTPUT_FILES.map((f) => (
                        <div key={f.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${f.badge}`}>
                          {f.icon === "pdf"
                            ? <FileText size={14} className="opacity-60 flex-shrink-0" />
                            : <CheckCircle size={14} className="opacity-50 flex-shrink-0" />
                          }
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{f.label}</p>
                            <p className="text-xs opacity-60">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={download}
                        className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
                      >
                        <Download size={14} />
                        Download ZIP
                      </button>
                      <button
                        onClick={reset}
                        className="text-sm font-medium px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        Process another
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What&apos;s inside the ZIP</h2>
            <p className="text-gray-500">Six files — every format you&apos;ll ever need</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Transparent PNG",
                file: "logo-transparent.png",
                desc: "Background removed. Place it on any color or image.",
                preview: "checkerboard",
                useCases: ["Website headers", "Social media", "Presentations"],
              },
              {
                title: "Black Version",
                file: "logo-black.png",
                desc: "All shapes filled solid black on a transparent background.",
                preview: "white",
                useCases: ["Light backgrounds", "Print documents", "Embroidery"],
              },
              {
                title: "White Version",
                file: "logo-white.png",
                desc: "All shapes filled solid white on a transparent background.",
                preview: "dark",
                useCases: ["Dark backgrounds", "Footer logos", "Merchandise"],
              },
              {
                title: "On White Background",
                file: "logo-on-white.png",
                desc: "Full-color logo with a clean white background, ready to share.",
                preview: "plain-white",
                useCases: ["Email signatures", "Documents", "Invoices"],
              },
              {
                title: "On Dark Background",
                file: "logo-on-dark.png",
                desc: "Full-color logo on a dark background for dark-mode contexts.",
                preview: "plain-dark",
                useCases: ["Dark-mode websites", "Slide decks", "Video intros"],
              },
              {
                title: "Brand Guidelines PDF",
                file: "brand-guidelines.pdf",
                desc: "Color palette, typography, clear space rules, and usage dos & don'ts.",
                preview: "pdf",
                useCases: ["Share with designers", "Agency briefs", "Style guide"],
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="h-28 flex items-center justify-center"
                  style={
                    item.preview === "checkerboard" ? {
                      backgroundImage: "linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
                    } : item.preview === "dark" || item.preview === "plain-dark" ? { background: "#14142b" }
                      : item.preview === "pdf" ? { background: "linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)" }
                      : { background: "#f9fafb" }
                  }
                >
                  {item.preview === "pdf" ? (
                    <FileText size={32} className="text-violet-400" />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={
                        item.preview === "dark" || item.preview === "plain-dark" ? { color: "white" }
                        : item.preview === "white" ? { color: "#111827" }
                        : { color: "#7c3aed" }
                      }
                    >
                      CC
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-mono text-gray-400 mb-2">{item.file}</p>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
                  <div className="space-y-1">
                    {item.useCases.map((u) => (
                      <div key={u} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                        {u}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">Three steps. Under a minute.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Name & upload", desc: "Enter your brand name, then drag & drop your logo file." },
              { step: "2", title: "We process it", desc: "Background is removed, all variants are generated, and the Brand PDF is built." },
              { step: "3", title: "Download the ZIP", desc: "One click gets you 6 files — ready for web, print, and everywhere in between." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CreaCurve</span>
          <div className="flex gap-4">
            <Link href="/terms"   className="hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
            <Link href="/refund"  className="hover:text-gray-700 transition-colors">Refund</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
