"use client";

import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The team delivered something I couldn't have imagined myself. The logo perfectly captures what our company stands for.",
    name: "Sarah Chen",
    company: "Finova Labs",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Fast, professional, and incredibly responsive. We had our new brand identity in under 3 days.",
    name: "Marcus Williams",
    company: "BuildRight Co.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "I've worked with design agencies before, but CreaCurve's quality-to-price ratio is in a completely different league.",
    name: "Amara Osei",
    company: "Luma Fitness",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The industry-matching really shows. Our healthcare logo looks credible and trustworthy — exactly what we needed.",
    name: "Dr. James Park",
    company: "PeakMed Clinic",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
  },
  {
    quote: "Unlimited revisions meant we never felt rushed. The team stuck with us until the logo was exactly right.",
    name: "Leila Santos",
    company: "Arco Studio",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    quote: "Our rebrand went smoothly thanks to the full brand kit. Everything was cohesive from day one.",
    name: "Tom Nguyen",
    company: "Drift Commerce",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">
            Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Loved by founders{" "}
            <span
              className="font-serif italic font-normal"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
            >
              worldwide.
            </span>
          </h2>
          {/* Trustpilot badge */}
          <div className="inline-flex items-center gap-3 border border-gray-200 bg-white rounded-full px-5 py-2.5 mt-2">
            {/* Trustpilot logo */}
            <svg viewBox="0 0 126 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto" aria-label="Trustpilot">
              <path d="M17 0l3.93 12.09H34L23.03 19.6l3.93 12.09L17 24.18 7.04 31.69 11 19.6 0 12.09h13.07z" fill="#00B67A"/>
              <path d="M24.37 22.2l-.9-2.6-6.47 4.58 7.37-1.98z" fill="#005128"/>
              <text x="40" y="24" fontSize="18" fontWeight="700" fill="#191919" fontFamily="system-ui,sans-serif">Trustpilot</text>
            </svg>
            <div className="w-px h-4 bg-gray-200" />
            <span className="flex gap-0.5 text-[#00B67A] text-sm font-bold" aria-hidden="true">★★★★★</span>
            <span className="text-sm font-semibold text-gray-900">4.9</span>
            <span className="text-sm text-gray-400">· 1,200+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="relative bg-white border border-gray-200 rounded-2xl p-7 flex flex-col gap-5 hover:shadow-sm transition-all duration-200"
            >
              {/* Large decorative quote mark */}
              <span
                aria-hidden="true"
                className="absolute top-5 right-6 text-5xl font-serif text-gray-100 select-none leading-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 text-yellow-400 text-sm" aria-label="5 out of 5 stars">
                ★★★★★
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-gray-700 leading-relaxed flex-1 relative z-10">
                {t.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full shrink-0 bg-gray-100"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
