"use client";

import { motion } from "framer-motion";

const tiles = [
  {
    icon: "🎨",
    title: "Logo Variations",
    body: "Full colour, white, black, monochrome, transparent background — every format your team needs.",
    span: "md:col-span-2",
    color: "#7c3aed",
    detail: "SVG · PNG · PDF · ICO",
  },
  {
    icon: "📱",
    title: "Social Media",
    body: "Instagram, Twitter, LinkedIn, Facebook — sized and designed to convert.",
    span: "",
    color: "#06b6d4",
    detail: "13 platforms",
  },
  {
    icon: "👕",
    title: "Merchandise",
    body: "T-shirts, mugs, tote bags, hats — print-ready files with bleed marks.",
    span: "",
    color: "#fb7185",
    detail: "8 mockups",
  },
  {
    icon: "📄",
    title: "Stationery",
    body: "Business card, letterhead, invoice, email signature — complete professional identity.",
    span: "",
    color: "#f59e0b",
    detail: "10 files",
  },
  {
    icon: "🏪",
    title: "Signage & Print",
    body: "Billboard, storefront sign, banner, poster — ready for the physical world.",
    span: "",
    color: "#10b981",
    detail: "6 formats",
  },
  {
    icon: "📦",
    title: "Packaging",
    body: "Product box, bag, label, hangtag — retail-ready packaging designs.",
    span: "",
    color: "#a78bfa",
    detail: "4 designs",
  },
  {
    icon: "🌐",
    title: "Web & Digital",
    body: "Hero banner, app screenshot, newsletter header, favicon — complete web presence.",
    span: "md:col-span-2",
    color: "#7c3aed",
    detail: "6 assets",
  },
];

export function BentoSection() {
  return (
    <section className="w-full py-32 lg:py-40 px-6 md:px-12 lg:px-20 xl:px-28">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.18)", color: "#67e8f9" }}
          >
            What&apos;s included
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-bold tracking-tight text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.95] max-w-xl">
              Everything your brand needs, instantly.
            </h2>
            <p className="text-white/40 text-base max-w-xs md:text-right">
              60+ assets across 8 categories, all generated from a single logo upload.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              className={`${tile.span} relative rounded-3xl p-7 overflow-hidden group`}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              whileHover={{
                scale: 1.02,
                borderColor: `${tile.color}30`,
                boxShadow: `0 16px 50px ${tile.color}0f`,
              }}
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 20%, ${tile.color}08 0%, transparent 60%)` }}
              />

              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${tile.color}50, transparent)` }} />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5"
                  style={{ background: `${tile.color}10`, border: `1px solid ${tile.color}18` }}
                >
                  {tile.icon}
                </div>

                {/* Detail badge */}
                <div
                  className="absolute top-0 right-0 px-2.5 py-1 rounded-xl text-xs font-medium"
                  style={{ background: `${tile.color}10`, color: tile.color }}
                >
                  {tile.detail}
                </div>

                <h3 className="font-semibold text-white text-lg mb-2">{tile.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{tile.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
