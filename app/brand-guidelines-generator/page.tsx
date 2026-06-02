import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/brand-guidelines-generator`;

export const metadata: Metadata = {
  title: "Free Brand Guidelines Generator — PDF Brand Style Guide | CreaCurve",
  description: "Generate a professional brand guidelines PDF from your logo free online. Includes color palette with HEX/RGB/CMYK values, typography, and logo usage rules. Download instantly.",
  keywords: ["brand guidelines generator", "brand style guide generator", "brand guide pdf", "brand guidelines pdf free", "logo brand guidelines", "brand identity guide"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Brand Guidelines Generator", description: "Generate a professional brand guidelines PDF from your logo. Free, instant, no account.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Brand Guidelines Generator",
  description: "Free online tool to generate a professional 5-page brand guidelines PDF from any logo. Includes color palette extraction, typography recommendations, and logo usage rules.",
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
  { label: "Logo Mockup Generator", href: "/logo-mockup-generator", desc: "3D card, wall & brand board mockups" },
  { label: "Logo to PSD Converter", href: "/logo-to-psd", desc: "Photoshop-ready PSD from any logo" },
  { label: "All Logo Files (ZIP)", href: "/logo-prep", desc: "All 19 formats in one download" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <ToolLandingPage config={{
        headline: "Generate Brand Guidelines — Free PDF",
        subheadline: "Upload your logo and get a professional 5-page brand guidelines PDF with your color palette (HEX, RGB, CMYK), typography recommendations, and logo usage dos & don'ts. Share with designers, clients, or agencies instantly.",
        badge: "Free Brand Guide Generator",
        ctaLabel: "Generate Brand Guidelines Free",
        heroFeatures: ["Auto color extraction", "HEX / RGB / CMYK values", "5-page PDF", "Logo usage rules", "No design skills needed"],
        outputFiles: [
          { label: "brand-guidelines.pdf", desc: "5-page US Letter brand style guide PDF" },
          { label: "copyright-certificate.pdf", desc: "Official copyright ownership certificate" },
          { label: "logo-transparent.png", desc: "Transparent PNG for immediate use" },
          { label: "logo-on-white.png", desc: "Logo on white background" },
          { label: "logo-on-dark.png", desc: "Logo on dark background" },
          { label: "logo-black.png", desc: "Black silhouette variant" },
          { label: "logo.svg", desc: "SVG vector container" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo.psd", desc: "Photoshop flat RGBA document" },
          { label: "favicon-16/32/192.png", desc: "Browser & PWA favicons" },
          { label: "mockup-brand-board.png", desc: "2D brand board mockup" },
          { label: "mockup-3d-card.png", desc: "3D perspective card mockup" },
        ],
        howItWorks: [
          { step: "1", title: "Enter brand details", desc: "Type your brand name, owner name, and tagline." },
          { step: "2", title: "Upload your logo", desc: "Drag & drop any PNG, JPEG, or WebP logo file." },
          { step: "3", title: "Download the PDF", desc: "Your brand guidelines PDF is ready in ~20 seconds, inside a ZIP with 18 other files." },
        ],
        faqs: [
          { q: "What is included in the brand guidelines PDF?", a: "The 5-page PDF includes: page 1 — your logo displayed on white and dark backgrounds; page 2 — your extracted color palette with HEX, RGB, and CMYK values; page 3 — typography and font pairing recommendations; page 4 — logo usage dos & don'ts with clear/space rules; page 5 — summary and contact." },
          { q: "How does color extraction work?", a: "The tool analyzes the pixel data of your logo and extracts the dominant colors. It then provides those colors in HEX, RGB, and CMYK formats — ready to share with printers, designers, or developers." },
          { q: "Can I share this with my designer or printer?", a: "Yes — that's exactly what brand guidelines are for. The PDF is a US Letter format document you can email or share as a link." },
          { q: "Is it really free?", a: "Yes, first use is completely free. No account, no watermark, no credit card needed." },
          { q: "Do I need to be a designer to use this?", a: "No design skills required. Upload your logo, fill in your brand name, and the tool generates everything automatically." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
