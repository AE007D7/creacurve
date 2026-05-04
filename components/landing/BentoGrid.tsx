"use client";

import { motion } from "framer-motion";

const CATEGORIES = [
  {
    icon: "✦",
    title: "Logo Variations",
    description: "8 files — Original, white, black, monochrome, favicon pack",
    color: "#7c3aed",
    span: "col-span-2",
    items: ["logo-original.png", "logo-white.png", "logo-black.png", "logo-favicon.ico"],
  },
  {
    icon: "📄",
    title: "Stationery",
    description: "10 files — Business cards, letterhead, invoice, email signature",
    color: "#06b6d4",
    span: "col-span-1",
    items: ["business-card-front.png", "letterhead-a4.png", "invoice.png"],
  },
  {
    icon: "📱",
    title: "Social Media",
    description: "13 files — Instagram, LinkedIn, Twitter, YouTube, TikTok",
    color: "#ec4899",
    span: "col-span-1",
    items: ["instagram-post.png", "instagram-story.png", "linkedin-banner.png"],
  },
  {
    icon: "👕",
    title: "Merchandise",
    description: "8 files — T-shirts, mugs, tote bags, sticker sheets",
    color: "#f59e0b",
    span: "col-span-1",
    items: ["tshirt-flatlay.png", "coffee-mug.png", "tote-bag.png"],
  },
  {
    icon: "🏪",
    title: "Signage & Print",
    description: "6 files — Storefront, billboard, poster, roll-up banner",
    color: "#10b981",
    span: "col-span-2",
    items: ["storefront-sign.png", "billboard-mockup.png", "poster-a3.png"],
  },
  {
    icon: "💻",
    title: "Web & Digital",
    description: "6 files — Hero section, app screen, newsletter, ads",
    color: "#06b6d4",
    span: "col-span-1",
    items: ["website-hero.png", "mobile-app-screen.png", "email-newsletter.png"],
  },
  {
    icon: "🍽️",
    title: "Hospitality",
    description: "8 files — Menu, loyalty card, gift card, receipt",
    color: "#fb7185",
    span: "col-span-1",
    items: ["restaurant-menu.png", "loyalty-card.png", "gift-card.png"],
  },
  {
    icon: "📦",
    title: "Packaging",
    description: "4 files — Product box, shopping bag, labels",
    color: "#8b5cf6",
    span: "col-span-1",
    items: ["product-box.png", "shopping-bag.png", "product-label.png"],
  },
  {
    icon: "📚",
    title: "Brand Guidelines",
    description: "4 PDFs — Guidelines, voice guide, color poster, typography",
    color: "#a78bfa",
    span: "col-span-1",
    items: ["brand-guidelines.pdf", "brand-voice.pdf", "color-palette.pdf"],
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.title}
          className="rounded-2xl p-6 relative overflow-hidden cursor-pointer group"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          whileHover={{
            background: `rgba(${hexToRgbValues(cat.color)}, 0.06)`,
            borderColor: `${cat.color}30`,
            y: -3,
          }}
        >
          {/* Hover glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${cat.color}08 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{
                background: `${cat.color}15`,
                border: `1px solid ${cat.color}25`,
              }}
            >
              {cat.icon}
            </div>

            <h3 className="font-semibold text-white text-base mb-1">{cat.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>

            {/* File list */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2 py-0.5 rounded-md font-mono"
                  style={{
                    background: `${cat.color}10`,
                    color: `${cat.color}cc`,
                    border: `1px solid ${cat.color}15`,
                  }}
                >
                  {item.split(".").pop()}
                </span>
              ))}
              <span
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                +more
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function hexToRgbValues(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "124,58,237";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
