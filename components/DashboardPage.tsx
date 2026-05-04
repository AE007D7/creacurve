"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CreaCurveLogo } from "./CreaCurveLogo";
import type { Project, Asset, BrandData } from "@/lib/types";
import { ASSET_CATEGORIES } from "@/lib/types";
import Link from "next/link";

interface LightboxProps {
  asset: Asset;
  onClose: () => void;
}

function Lightbox({ asset, onClose }: LightboxProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.9)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-4xl w-full rounded-2xl overflow-hidden relative"
        style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h3 className="text-white font-medium text-sm">{asset.name}</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {asset.width && asset.height ? `${asset.width}×${asset.height}px` : ""}
              {asset.file_size ? ` · ${(asset.file_size / 1024).toFixed(0)}KB` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={asset.url}
              download
              className="px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                boxShadow: "0 0 15px rgba(124,58,237,0.3)",
              }}
            >
              ↓ Download
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="p-6 flex items-center justify-center min-h-[300px] max-h-[70vh]">
          {asset.url.endsWith(".pdf") ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-white/50 mb-4">PDF Document</p>
              <a
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm text-white"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                Open PDF
              </a>
            </div>
          ) : (
            <img
              src={asset.url}
              alt={asset.name}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DashboardPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Try the universal project API first (works in dev + prod)
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data as Project);
          // Dev mode stores assets embedded in the project JSON
          if (Array.isArray(data.assets) && data.assets.length > 0) {
            setAssets(data.assets as Asset[]);
            return;
          }
        }
      } catch { /* fall through to supabase */ }

      // Supabase fallback for production
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const [projectRes, assetsRes] = await Promise.all([
          supabase.from("projects").select("*").eq("id", projectId).single(),
          supabase.from("assets").select("*").eq("project_id", projectId).order("category"),
        ]);
        if (projectRes.data) setProject(projectRes.data as Project);
        if (assetsRes.data) setAssets(assetsRes.data as Asset[]);
      } catch { /* ignore */ }
    };
    fetchData();
  }, [projectId]);

  const brandData = project?.brand_data as BrandData | null;

  const filteredAssets =
    activeTab === "all" ? assets : assets.filter((a) => a.category === activeTab);

  const categories = Object.entries(ASSET_CATEGORIES).filter(([key]) =>
    assets.some((a) => a.category === key)
  );

  const handleDownloadZip = async () => {
    if (!project?.zip_url) return;
    setIsDownloadingZip(true);
    window.location.href = project.zip_url;
    setTimeout(() => setIsDownloadingZip(false), 2000);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Lightbox */}
      <AnimatePresence>
        {selectedAsset && (
          <Lightbox asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <CreaCurveLogo size={28} showText={true} />
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <span className="text-white/60 text-sm">{project.brand_name || "Your Brand"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              + New Brand Kit
            </Link>
            <motion.button
              onClick={handleDownloadZip}
              disabled={!project.zip_url || isDownloadingZip}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isDownloadingZip ? "Preparing..." : "↓ Download ZIP"}
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Brand summary */}
        {brandData && (
          <motion.div
            className="rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-6"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Logo preview */}
            <div
              className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <img src={project.logo_url} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
            </div>

            {/* Brand info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-semibold text-lg truncate">
                {project.brand_name || "Your Brand"}
              </h1>
              <p className="text-white/40 text-sm capitalize">
                {brandData.style} · {brandData.industry}
              </p>
            </div>

            {/* Color palette */}
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs mr-1">Colors</span>
              <div className="flex -space-x-1">
                {[...brandData.primaryColors, ...brandData.secondaryColors, ...brandData.accentColors]
                  .slice(0, 5)
                  .map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#0a0a0a]"
                      style={{ background: c.hex }}
                      title={c.name}
                    />
                  ))}
              </div>
            </div>

            {/* Tagline */}
            {brandData.taglineSuggestions?.[0] && (
              <div className="font-bold tracking-tight text-white/50 text-sm italic hidden lg:block">
                "{brandData.taglineSuggestions[0]}"
              </div>
            )}

            {/* Asset count */}
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-white">{assets.length}</div>
              <div className="text-white/30 text-xs">assets</div>
            </div>
          </motion.div>
        )}

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === "all" ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
              border: activeTab === "all" ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: activeTab === "all" ? "#a78bfa" : "rgba(255,255,255,0.5)",
            }}
          >
            All ({assets.length})
          </button>
          {categories.map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === key ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                border: activeTab === key ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.08)",
                color: activeTab === key ? "#a78bfa" : "rgba(255,255,255,0.5)",
              }}
            >
              {cat.icon} {cat.label} ({assets.filter((a) => a.category === key).length})
            </button>
          ))}
        </div>

        {/* Asset grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {filteredAssets.map((asset, i) => (
              <motion.div
                key={asset.id}
                className="rounded-xl overflow-hidden cursor-pointer group relative"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  aspectRatio: "1",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                whileHover={{ scale: 1.03, borderColor: "rgba(124,58,237,0.3)" }}
                onClick={() => setSelectedAsset(asset)}
              >
                {asset.thumbnail_url ? (
                  <img
                    src={asset.thumbnail_url}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-2xl">
                      {ASSET_CATEGORIES[asset.category as keyof typeof ASSET_CATEGORIES]?.icon || "📁"}
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1"
                  style={{ background: "rgba(10,10,10,0.85)" }}
                >
                  <div className="text-white text-xs font-medium text-center px-2 leading-tight">
                    {asset.name}
                  </div>
                  <div className="text-white/40 text-xs">Click to view</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredAssets.length === 0 && (
          <div className="text-center py-20 text-white/30">
            No assets in this category yet.
          </div>
        )}
      </div>

      {/* Sticky download bar */}
      {project.zip_url && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex items-center gap-4 px-6 py-3 rounded-2xl"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(124,58,237,0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.15)",
            }}
          >
            <div className="text-sm text-white/60">
              <span className="font-semibold text-white">{assets.length} assets</span> ready
            </div>
            <motion.button
              onClick={handleDownloadZip}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              ↓ Download Full Kit (.zip)
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
