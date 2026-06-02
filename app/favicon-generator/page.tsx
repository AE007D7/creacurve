import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/favicon-generator`;

export const metadata: Metadata = {
  title: "Free Favicon Generator from Logo — 16px, 32px, 192px PNG | CreaCurve",
  description: "Generate favicons from your logo free online. Upload any PNG or JPEG logo and get favicon-16.png, favicon-32.png, and favicon-192.png instantly — plus 16 other professional logo files.",
  keywords: ["favicon generator", "favicon generator from logo", "create favicon from logo", "logo to favicon", "favicon png free", "website favicon generator", "pwa favicon"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Favicon Generator from Logo", description: "Generate 16px, 32px and 192px favicons from any logo. Free, instant, no account.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Favicon Generator",
  description: "Free online favicon generator that creates 16x16, 32x32, and 192x192px favicons from any logo. Uses AI to detect the icon/symbol portion for optimal favicon cropping.",
  url: URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", "@id": `${BASE}#organization`, name: "CreaCurve" },
};

const RELATED = [
  { label: "Logo to SVG Converter", href: "/logo-to-svg", desc: "SVG vector file from any logo" },
  { label: "Remove Logo Background", href: "/remove-logo-background", desc: "Get transparent PNG from any logo" },
  { label: "Brand Guidelines Generator", href: "/brand-guidelines-generator", desc: "PDF brand guide with color palette" },
  { label: "Logo Mockup Generator", href: "/logo-mockup-generator", desc: "3D card, wall & brand board mockups" },
  { label: "Logo to PSD Converter", href: "/logo-to-psd", desc: "Photoshop-ready PSD from any logo" },
  { label: "All Logo Files (ZIP)", href: "/logo-prep", desc: "All 19 formats in one download" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <ToolLandingPage config={{
        headline: "Generate Favicons from Your Logo — Free",
        subheadline: "Upload your logo and instantly get favicons at 16×16, 32×32, and 192×192px — the exact sizes needed for browser tabs, bookmarks, PWA manifests, and Android home screens.",
        badge: "AI-Powered Favicon Generator",
        ctaLabel: "Generate Favicons Free",
        heroFeatures: ["16×16px browser tab", "32×32px bookmarks", "192×192px PWA/Android", "AI icon detection", "No account needed"],
        outputFiles: [
          { label: "favicon-16.png", desc: "16×16px — browser tab" },
          { label: "favicon-32.png", desc: "32×32px — high-DPI tabs & bookmarks" },
          { label: "favicon-192.png", desc: "192×192px — PWA manifest & Android" },
          { label: "logo-transparent.png", desc: "Full transparent PNG as bonus" },
          { label: "logo.svg", desc: "SVG vector container" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo.psd", desc: "Photoshop flat RGBA document" },
          { label: "logo.ai", desc: "Adobe Illustrator compatible" },
          { label: "brand-guidelines.pdf", desc: "5-page brand style guide" },
          { label: "copyright-certificate.pdf", desc: "Ownership certificate" },
          { label: "mockup-3d-card.png", desc: "3D card mockup" },
          { label: "mockup-wall-3d.png", desc: "3D wall mockup" },
        ],
        howItWorks: [
          { step: "1", title: "Upload your logo", desc: "Drag & drop any PNG, JPEG, or WebP logo file." },
          { step: "2", title: "AI detects the icon", desc: "Claude AI identifies the icon/symbol part of your logo and crops it perfectly for favicons." },
          { step: "3", title: "Download all sizes", desc: "Get favicons at 16, 32, and 192px — plus 16 other professional brand files." },
        ],
        faqs: [
          { q: "What favicon sizes do I need?", a: "The three essential sizes are: 16×16px (browser tab), 32×32px (high-DPI displays and bookmarks), and 192×192px (Android home screen and PWA manifest). Some sites also use 180×180px for Apple Touch Icon — our 192px favicon works for this too." },
          { q: "How does the AI icon detection work?", a: "We use Claude AI (Anthropic's vision model) to analyze your logo and find the icon or symbol portion. It crops just the graphical element — not the text — so your favicon looks sharp at 16px instead of being an unreadable shrunken version of the full logo." },
          { q: "What format should I use for my website favicon?", a: "Use favicon-16.png and favicon-32.png in your HTML <link rel='icon'> tags. For PWA manifests, use favicon-192.png in your manifest.json icons array. For Apple devices, reference the 192px file as apple-touch-icon." },
          { q: "Is it free?", a: "Yes — first use is completely free. No account, no watermark, no credit card." },
          { q: "Can I use these favicons commercially?", a: "Yes. The generated files are yours. You own the rights to your original logo, and the favicons we generate from it are yours to use commercially." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
