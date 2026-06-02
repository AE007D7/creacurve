import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/logo-mockup-generator`;

export const metadata: Metadata = {
  title: "Free Logo Mockup Generator — 3D Card, Wall & Brand Board | CreaCurve",
  description: "Generate professional logo mockups free online. Upload your logo and get a 3D card mockup, frosted glass wall mockup, and 2D brand board — instantly. No Photoshop needed.",
  keywords: ["logo mockup generator", "free logo mockup", "logo mockup online", "3d logo mockup free", "business card mockup generator", "brand board generator", "logo presentation mockup"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Logo Mockup Generator", description: "Generate 3D card, wall & brand board mockups from your logo. Free, instant, no Photoshop.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Logo Mockup Generator",
  description: "Free online logo mockup generator that creates a 2D brand board, 3D perspective card mockup, and 3D frosted glass wall mockup from any logo upload.",
  url: URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", "@id": `${BASE}#organization`, name: "CreaCurve" },
};

const RELATED = [
  { label: "Logo to SVG Converter", href: "/logo-to-svg", desc: "SVG vector file from any logo" },
  { label: "Remove Logo Background", href: "/remove-logo-background", desc: "Get transparent PNG from any logo" },
  { label: "Favicon Generator", href: "/favicon-generator", desc: "16, 32, 192px favicons from your logo" },
  { label: "Brand Guidelines Generator", href: "/brand-guidelines-generator", desc: "PDF brand guide with color palette" },
  { label: "Logo to PSD Converter", href: "/logo-to-psd", desc: "Photoshop-ready PSD from any logo" },
  { label: "All Logo Files (ZIP)", href: "/logo-prep", desc: "All 19 formats in one download" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <ToolLandingPage config={{
        headline: "Generate Logo Mockups — Free & Instant",
        subheadline: "Upload your logo and get three professional-grade mockups: a 2D brand board, a 3D perspective card, and a metallic gold logo on a frosted glass office wall. Perfect for portfolios, client presentations, and social media.",
        badge: "Free Mockup Generator",
        ctaLabel: "Generate Mockups Free",
        heroFeatures: ["2D brand board", "3D card mockup", "3D wall mockup", "Gold metallic effect", "No Photoshop needed"],
        outputFiles: [
          { label: "mockup-brand-board.png", desc: "Logo on light and dark backgrounds side by side" },
          { label: "mockup-3d-card.png", desc: "3D perspective card with shadow and depth" },
          { label: "mockup-wall-3d.png", desc: "Gold metallic logo on frosted glass office wall" },
          { label: "logo-transparent.png", desc: "Transparent PNG" },
          { label: "logo-on-white.png", desc: "Logo on white background" },
          { label: "logo-on-dark.png", desc: "Logo on dark background" },
          { label: "logo.svg", desc: "SVG vector container" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo.psd", desc: "Photoshop flat RGBA document" },
          { label: "favicon-16/32/192.png", desc: "Browser & PWA favicons" },
          { label: "brand-guidelines.pdf", desc: "5-page brand style guide" },
          { label: "copyright-certificate.pdf", desc: "Ownership certificate" },
        ],
        howItWorks: [
          { step: "1", title: "Upload your logo", desc: "Drag & drop any PNG, JPEG, or WebP. Add your brand name for the wall mockup." },
          { step: "2", title: "We render 3 mockups", desc: "Brand board, 3D card, and frosted glass wall — generated in seconds." },
          { step: "3", title: "Download the ZIP", desc: "3 mockup PNGs plus 16 other professional brand files, all in one ZIP." },
        ],
        faqs: [
          { q: "What mockups are included?", a: "Three mockups are generated: (1) 2D Brand Board — your logo displayed side by side on white and dark backgrounds; (2) 3D Card Mockup — a business card perspective view with realistic shadow; (3) 3D Wall Mockup — your logo rendered in metallic gold on a frosted glass office wall." },
          { q: "Do I need Photoshop to use this?", a: "No Photoshop required. The mockups are generated server-side using Sharp image processing and are ready to download as PNG files." },
          { q: "Can I use these mockups in my portfolio?", a: "Yes — use them freely in your portfolio, client presentations, social media posts, or marketing materials." },
          { q: "How do I get the gold effect on the wall mockup?", a: "The wall mockup uses a metallic gold color gradient overlay applied to your logo. You don't need to do anything — it's automatic when you upload your logo." },
          { q: "Is it free?", a: "First use is completely free. No account, no watermark. After your first free generation, a $4.90 one-time payment unlocks unlimited access." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
