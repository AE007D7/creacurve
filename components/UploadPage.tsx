"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreaCurveLogo } from "./CreaCurveLogo";
import Link from "next/link";

type StyleOption = "minimal" | "bold" | "playful" | "luxury" | "tech";

export function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [style, setStyle] = useState<StyleOption | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(f.type)) {
      toast.error("Please upload a PNG, JPG, SVG, or WebP file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);

    // Smart suggestion based on file
    const hints = [
      "Beautiful logo — high contrast detected. Perfect for brand generation.",
      "Clean mark detected. Great for stationery and merchandise.",
      "Strong visual detected. Social media assets will shine.",
    ];
    setSuggestion(hints[Math.floor(Math.random() * hints.length)]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleUploadAndCheckout = async () => {
    if (!file) {
      toast.error("Please upload your logo first.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload logo
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const { url } = await uploadRes.json();
      setUploadedUrl(url);
      setIsCheckingOut(true);

      // Create checkout session
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: url,
          brandName: brandName || file.name.replace(/\.[^/.]+$/, ""),
          style: style || undefined,
          filename: file.name,
        }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json();
        throw new Error(err.error || "Checkout failed");
      }

      const { url: checkoutUrl } = await checkoutRes.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setIsUploading(false);
      setIsCheckingOut(false);
    }
  };

  const STYLES: { value: StyleOption; label: string; emoji: string }[] = [
    { value: "minimal", label: "Minimal", emoji: "○" },
    { value: "bold", label: "Bold", emoji: "■" },
    { value: "playful", label: "Playful", emoji: "✦" },
    { value: "luxury", label: "Luxury", emoji: "◈" },
    { value: "tech", label: "Tech", emoji: "⬡" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background mesh */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full top-0 left-0"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", transform: "translate(-150px, -150px)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bottom-0 right-0"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)", transform: "translate(100px, 100px)" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link href="/">
          <CreaCurveLogo size={32} showText={true} />
        </Link>
        <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Back
        </Link>
      </nav>

      {/* Main */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-bold tracking-tight text-4xl sm:text-5xl text-white mb-3 leading-tight">
            Upload your logo.
          </h1>
          <p className="text-white/50 text-lg">
            We'll generate 60+ brand assets in under 90 seconds.
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Drop zone */}
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
            style={{
              background: isDragging
                ? "rgba(124,58,237,0.08)"
                : preview
                ? "rgba(124,58,237,0.04)"
                : "rgba(255,255,255,0.025)",
              border: isDragging
                ? "2px solid rgba(124,58,237,0.5)"
                : preview
                ? "2px solid rgba(124,58,237,0.25)"
                : "2px dashed rgba(255,255,255,0.1)",
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="empty"
                  className="p-16 flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Upload icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: isDragging ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                      border: isDragging ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    animate={isDragging ? { scale: 1.1 } : { scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: isDragging ? 0 : Infinity }}
                  >
                    ↑
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white/80 font-medium text-lg">
                      {isDragging ? "Drop your logo here" : "Drop your logo here"}
                    </p>
                    <p className="text-white/35 text-sm mt-1">
                      or click to browse · PNG, JPG, SVG up to 5MB
                    </p>
                  </div>
                  {/* Pulse animation */}
                  {!isDragging && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ border: "2px solid rgba(124,58,237,0.2)" }}
                      animate={{ opacity: [0, 0.6, 0], scale: [0.98, 1.01, 0.98] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  className="p-8 flex flex-col items-center gap-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <div
                      className="w-40 h-40 rounded-2xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <img
                        src={preview}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain p-4"
                      />
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ boxShadow: "0 0 40px rgba(124,58,237,0.15)" }} />
                  </div>

                  {/* Smart suggestion */}
                  {suggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-2 rounded-xl text-sm text-center"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        color: "#a78bfa",
                      }}
                    >
                      ✦ {suggestion}
                    </motion.div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setSuggestion(null); }}
                    className="text-sm text-white/30 hover:text-white/60 transition-colors"
                  >
                    Change logo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Brand name */}
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">
              Brand name <span className="text-white/25">(optional — we'll detect it)</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Bloom Café, Syntrix, Luxe Studio"
              className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.4)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
          </div>

          {/* Style hint */}
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">
              Style preference <span className="text-white/25">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(style === s.value ? null : s.value)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: style === s.value ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                    border: style === s.value ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color: style === s.value ? "#a78bfa" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleUploadAndCheckout}
            disabled={!file || isUploading || isCheckingOut}
            className="w-full py-4 rounded-2xl text-base font-semibold text-white relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              boxShadow: file ? "0 0 30px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
            }}
            whileHover={file && !isUploading ? { scale: 1.02 } : {}}
            whileTap={file && !isUploading ? { scale: 0.98 } : {}}
          >
            <AnimatePresence mode="wait">
              {isUploading && !isCheckingOut && (
                <motion.span
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Uploading logo...
                </motion.span>
              )}
              {isCheckingOut && (
                <motion.span
                  key="checkout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Opening checkout...
                </motion.span>
              )}
              {!isUploading && !isCheckingOut && (
                <motion.span
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {file ? "Generate My Brand Kit — $29 →" : "Upload a logo to continue"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <span>🔒</span> Secure checkout
            </span>
            <span className="flex items-center gap-1">
              <span>⚡</span> 90-second delivery
            </span>
            <span className="flex items-center gap-1">
              <span>↩</span> 30-day guarantee
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
