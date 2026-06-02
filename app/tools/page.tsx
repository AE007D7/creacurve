import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/tools`;

export const metadata: Metadata = {
  title: "Free Logo & Branding Tools — All Free Online | CreaCurve",
  description: "All of CreaCurve's free logo and branding tools in one place. Logo to SVG converter, favicon generator, background remover, brand guidelines generator, logo mockup generator, and more.",
  keywords: ["free logo tools", "free branding tools", "logo converter online", "favicon generator free", "brand tools online", "logo design tools free"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Logo & Branding Tools", description: "All free logo tools by CreaCurve: SVG converter, favicon generator, background remover, brand guidelines, mockups.", url: URL, siteName: "CreaCurve", type: "website" },
};

const TOOLS = [
  {
    title: "Logo Prep Tool",
    desc: "Upload your logo once and download 19 professional files: transparent PNG, SVG, PSD, PDF, AI, favicons, brand guidelines, copyright cert & 3D mockups — all in one ZIP.",
    href: "/logo-prep",
    badge: "Most Popular",
    badgeColor: "bg-violet-100 text-violet-700",
    features: ["19 files in one ZIP", "SVG + PSD + AI + PDF", "Brand guidelines PDF", "3D mockups"],
  },
  {
    title: "Logo to SVG Converter",
    desc: "Convert any PNG or JPEG logo to SVG format. Compatible with Adobe Illustrator, Figma, Inkscape, and all browsers.",
    href: "/logo-to-svg",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["SVG 1.1 standard", "Illustrator compatible", "Figma ready", "Instant download"],
  },
  {
    title: "Logo Background Remover",
    desc: "Remove the background from any logo and get a transparent PNG. No Photoshop, no account, no watermark.",
    href: "/remove-logo-background",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["True transparency", "No watermark", "JPEG & PNG input", "Instant result"],
  },
  {
    title: "Favicon Generator",
    desc: "Generate favicons from your logo at 16×16, 32×32, and 192×192px using AI-powered icon detection.",
    href: "/favicon-generator",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["16, 32, 192px", "PWA & Android ready", "AI icon detection", "Browser tab ready"],
  },
  {
    title: "Brand Guidelines Generator",
    desc: "Generate a professional 5-page brand guidelines PDF with your color palette (HEX/RGB/CMYK), typography, and logo usage rules.",
    href: "/brand-guidelines-generator",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["5-page PDF", "Color extraction", "HEX / RGB / CMYK", "Logo usage rules"],
  },
  {
    title: "Logo Mockup Generator",
    desc: "Generate a 2D brand board, 3D card mockup, and 3D gold metallic wall mockup from your logo — no Photoshop needed.",
    href: "/logo-mockup-generator",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["Brand board", "3D card mockup", "Gold wall mockup", "PNG download"],
  },
  {
    title: "Logo to PSD Converter",
    desc: "Convert any logo PNG to a Photoshop PSD file. Opens in Photoshop CS4+, Affinity Photo, and GIMP.",
    href: "/logo-to-psd",
    badge: "Free",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["Flat RGBA PSD", "Photoshop CS4+", "Affinity Photo", "GIMP compatible"],
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Logo & Branding Tools by CreaCurve",
  description: "A collection of free online logo and branding tools including SVG converter, favicon generator, background remover, brand guidelines generator, and logo mockup generator.",
  url: URL,
  provider: { "@type": "Organization", "@id": `${BASE}#organization`, name: "CreaCurve" },
  hasPart: TOOLS.map((t) => ({
    "@type": "SoftwareApplication",
    name: t.title,
    url: `${BASE}${t.href}`,
    applicationCategory: "DesignApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
              Crea<span style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Curve</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/logo-design" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Logo Design</Link>
              <Link href="/logo-prep" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
                Try Free
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 border border-violet-200 bg-violet-50 rounded-full px-3 py-1 mb-6">
              <Sparkles size={12} className="text-violet-500" />
              <span className="text-xs font-medium text-violet-700">All Free · No Account · No Watermark</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5">
              Free Logo & Branding Tools
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Professional-grade tools for designers, entrepreneurs, and agencies. Convert, prepare, and present your logo — instantly, free.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-200"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{tool.title}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tool.badgeColor}`}>{tool.badge}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.desc}</p>
                  <ul className="space-y-1.5">
                    {tool.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-medium text-violet-600">Try free</span>
                  <ArrowRight size={14} className="text-violet-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Need a custom logo designed?</h2>
            <p className="text-gray-500 mb-8">Industry-specialist designers deliver multiple logo concepts in 24–48 hours. Starting at $35.</p>
            <Link href="/logo-design" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              View Logo Design Packages <ArrowRight size={14} />
            </Link>
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
    </>
  );
}
