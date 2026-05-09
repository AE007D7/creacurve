"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, CheckCircle, Loader2, ImageIcon, X, Sparkles, ChevronDown } from "lucide-react";
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

// ── Upload Zone ───────────────────────────────────────────────────────────────

type State =
  | { phase: "idle" }
  | { phase: "preview"; file: File; previewUrl: string }
  | { phase: "processing" }
  | { phase: "done"; zipUrl: string; fileName: string };

export default function LogoPrepPage() {
  const [state, setState] = useState<State>({ phase: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    setState({ phase: "preview", file, previewUrl });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    if (state.phase === "preview") URL.revokeObjectURL(state.previewUrl);
    if (state.phase === "done") URL.revokeObjectURL(state.zipUrl);
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
      const res = await fetch("/api/logo-prep", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(err.error || "Processing failed. Please try again.");
        setState({ phase: "idle" });
        return;
      }
      const blob = await res.blob();
      const zipUrl = URL.createObjectURL(blob);
      setState({ phase: "done", zipUrl, fileName: "logo-files.zip" });
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

      {/* Hero */}
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
              <span className="text-xs font-medium text-violet-700 tracking-wide">
                Free Logo Prep Tool
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.08] mb-5">
              Upload your logo.{" "}
              <span
                className="font-serif italic font-normal"
                style={{
                  fontFamily: "Georgia, serif",
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Get all versions.
              </span>
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
              Upload your AI-generated logo in JPEG or PNG. We&apos;ll remove the background and give you a transparent PNG, a black version, and a white version — ready to use everywhere.
            </p>
          </motion.div>

          {/* Upload / Process / Done card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {state.phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
                    onChange={onInputChange}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <Upload size={24} className="text-violet-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        Drop your logo here
                      </p>
                      <p className="text-sm text-gray-400">
                        or <span className="text-violet-600 font-medium">click to browse</span> — JPEG, PNG, WebP
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {state.phase === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Checkerboard preview */}
                  <div
                    className="relative flex items-center justify-center p-8"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <img
                      src={state.previewUrl}
                      alt="Logo preview"
                      className="max-h-48 max-w-full object-contain"
                    />
                  </div>
                  <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {state.file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({(state.file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      onClick={process}
                      className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
                    >
                      <Sparkles size={14} />
                      Remove background &amp; generate files
                    </button>
                  </div>
                </motion.div>
              )}

              {state.phase === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl p-12 bg-white"
                >
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 animate-spin" />
                      <Sparkles size={20} className="absolute inset-0 m-auto text-violet-500" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900 mb-1">Processing your logo…</p>
                      <p className="text-sm text-gray-400">Removing background and creating all versions</p>
                    </div>

                    {/* Step indicators */}
                    <div className="flex items-center gap-6 mt-2">
                      {["Remove background", "Black version", "White version", "Create ZIP"].map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-1.5">
                          <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                            <Loader2 size={14} className="text-violet-500 animate-spin" style={{ animationDelay: `${i * 0.2}s` }} />
                          </div>
                          <span className="text-xs text-gray-400 text-center">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {state.phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  <div className="p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 mb-1">Your files are ready!</p>
                      <p className="text-sm text-gray-500">ZIP contains 3 PNG files — transparent, black, and white versions</p>
                    </div>

                    {/* File list */}
                    <div className="w-full max-w-xs mt-2 space-y-2">
                      {[
                        { label: "logo-transparent.png", desc: "No background", color: "bg-violet-50 border-violet-200 text-violet-700" },
                        { label: "logo-black.png",       desc: "Black on transparent", color: "bg-gray-50 border-gray-200 text-gray-700" },
                        { label: "logo-white.png",       desc: "White on transparent", color: "bg-slate-50 border-slate-200 text-slate-600" },
                      ].map((f) => (
                        <div key={f.label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${f.color}`}>
                          <div>
                            <p className="text-xs font-semibold">{f.label}</p>
                            <p className="text-xs opacity-60">{f.desc}</p>
                          </div>
                          <CheckCircle size={14} className="opacity-50" />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-2">
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

      {/* What you get */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What&apos;s inside the ZIP
            </h2>
            <p className="text-gray-500">Three ready-to-use files for web and print</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Transparent PNG",
                file: "logo-transparent.png",
                desc: "Your logo with the white background removed. Perfect for placing on any color.",
                bg: "bg-[length:20px_20px]",
                preview: "checkerboard",
                useCases: ["Website headers", "Social media", "Presentations"],
              },
              {
                title: "Black Version",
                file: "logo-black.png",
                desc: "All logo shapes filled solid black on a transparent background.",
                preview: "white",
                useCases: ["Light backgrounds", "Print documents", "Embroidery"],
              },
              {
                title: "White Version",
                file: "logo-white.png",
                desc: "All logo shapes filled solid white on a transparent background.",
                preview: "dark",
                useCases: ["Dark backgrounds", "Footer logos", "Merchandise"],
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
                {/* Preview area */}
                <div
                  className="h-32 flex items-center justify-center"
                  style={
                    item.preview === "checkerboard"
                      ? {
                          backgroundImage:
                            "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                          backgroundSize: "16px 16px",
                          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                        }
                      : item.preview === "dark"
                      ? { background: "#1a1a2e" }
                      : { background: "#f9fafb" }
                  }
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                    style={
                      item.preview === "dark"
                        ? { color: "white" }
                        : item.preview === "white"
                        ? { color: "#111827" }
                        : { color: "#7c3aed" }
                    }
                  >
                    CC
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-mono text-gray-400 mb-2">{item.file}</p>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="space-y-1">
                    {item.useCases.map((u) => (
                      <div key={u} className="flex items-center gap-2 text-xs text-gray-500">
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

      {/* How it works */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
            Three steps. Thirty seconds.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload your logo", desc: "Drag & drop your JPEG, PNG or WebP logo file." },
              { step: "2", title: "We process it", desc: "Background is removed and all three versions are generated instantly." },
              { step: "3", title: "Download the ZIP", desc: "Get all files in one click. Ready for web, print, and everything in between." },
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

      {/* Footer */}
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
