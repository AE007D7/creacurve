"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "I launched my café brand in an afternoon. The storefront sign mockup alone would've cost me $800 from a designer. CreaCurve gave me 60+ assets for $29.",
    author: "Sofia Chen",
    role: "Founder, Bloom Café",
    avatar: "#7c3aed",
    stars: 5,
  },
  {
    quote: "The brand guidelines PDF is the real gem. Clients look at it and think we have a full creative team. Worth every penny.",
    author: "Marcus Rivera",
    role: "Creative Director",
    avatar: "#06b6d4",
    stars: 5,
  },
  {
    quote: "Launched a tech startup. Had a logo from Figma. 90 seconds later I had pitch deck slides, a LinkedIn banner, t-shirt mockups — everything. Insane.",
    author: "Yuki Tanaka",
    role: "Co-founder, Syntrix",
    avatar: "#10b981",
    stars: 5,
  },
  {
    quote: "I use it for every client I onboard. It sets expectations beautifully and the deliverables are genuinely polished. My clients are always impressed.",
    author: "Aisha Okonkwo",
    role: "Brand Consultant",
    avatar: "#fb7185",
    stars: 5,
  },
  {
    quote: "The merchandise mockups look like they came from a proper photo shoot. I ordered actual t-shirts using the designs — sold 200 in the first week.",
    author: "James Whitfield",
    role: "Streetwear Brand Owner",
    avatar: "#f59e0b",
    stars: 5,
  },
  {
    quote: "This is what AI should be used for. Not replacing creativity — amplifying it. My logo in, a full brand universe out.",
    author: "Leila Nasseri",
    role: "Graphic Designer",
    avatar: "#8b5cf6",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative z-10 py-24 px-6 overflow-hidden">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-bold tracking-tight text-4xl sm:text-5xl text-white mb-4">
          Loved by founders, designers & creators.
        </h2>
        <p className="text-white/40">Real reviews from real brands</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            whileHover={{ y: -3, borderColor: `${t.avatar}25` }}
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[...Array(t.stars)].map((_, j) => (
                <svg key={j} className="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p className="text-white/65 text-sm leading-relaxed mb-6">"{t.quote}"</p>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `${t.avatar}25`, border: `1px solid ${t.avatar}30` }}
              >
                {t.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{t.author}</div>
                <div className="text-white/35 text-xs">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
