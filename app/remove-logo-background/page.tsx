import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/remove-logo-background`;

export const metadata: Metadata = {
  title: "Free Logo Background Remover — Transparent PNG Instantly | CreaCurve",
  description: "Remove the background from any logo free online. Upload your PNG or JPEG logo and get a transparent PNG in seconds — no Photoshop, no account, no watermark.",
  keywords: ["remove logo background", "logo background remover", "transparent logo png", "remove background from logo", "logo transparent png free", "logo no background"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Logo Background Remover", description: "Remove your logo background and get transparent PNG free. No account needed.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Logo Background Remover",
  description: "Free online tool to remove the background from any logo and get a transparent PNG file instantly.",
  url: URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", "@id": `${BASE}#organization`, name: "CreaCurve" },
};

const RELATED = [
  { label: "Logo to SVG Converter", href: "/logo-to-svg", desc: "SVG vector file from any logo" },
  { label: "Favicon Generator", href: "/favicon-generator", desc: "16, 32, 192px favicons from your logo" },
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
        headline: "Remove Your Logo Background — Free",
        subheadline: "Upload any logo and get a transparent PNG with the background removed instantly. No Photoshop, no expensive software, no account required. Also includes 18 other professional logo files.",
        badge: "Free Background Remover",
        ctaLabel: "Remove Background Free",
        heroFeatures: ["True transparent PNG", "No watermark", "No account required", "JPEG & PNG input", "18 bonus formats"],
        outputFiles: [
          { label: "logo-transparent.png", desc: "Background removed, true transparency" },
          { label: "logo-on-white.png", desc: "Full color on white background" },
          { label: "logo-on-dark.png", desc: "Full color on dark background" },
          { label: "logo-black.png", desc: "Black silhouette, transparent bg" },
          { label: "logo-white.png", desc: "White silhouette, transparent bg" },
          { label: "logo.svg", desc: "SVG vector container" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo.psd", desc: "Photoshop flat RGBA document" },
          { label: "logo.ai", desc: "Adobe Illustrator compatible" },
          { label: "favicon-16/32/192.png", desc: "Browser & PWA favicons" },
          { label: "brand-guidelines.pdf", desc: "5-page brand style guide" },
          { label: "mockup-3d-card.png", desc: "3D card mockup" },
        ],
        howItWorks: [
          { step: "1", title: "Upload your logo", desc: "Drag & drop any PNG or JPEG logo — even with a white or colored background." },
          { step: "2", title: "We remove the background", desc: "Our tool processes alpha channels to create a clean transparent PNG." },
          { step: "3", title: "Download the ZIP", desc: "Get transparent PNG plus 18 other professional logo files." },
        ],
        faqs: [
          { q: "Does it really remove the background for free?", a: "Yes — completely free for your first use. No account, no watermark, no credit card. The tool uses Sharp image processing to isolate your logo on a transparent background." },
          { q: "What background colors can it remove?", a: "The tool removes backgrounds by processing the alpha channel of your logo image. For best results, upload a logo with a solid white or light-colored background. If your logo already has a transparent background (PNG), it will be preserved." },
          { q: "Will the transparent PNG have a watermark?", a: "No watermark, ever. The files are yours to use commercially." },
          { q: "What image formats can I upload?", a: "JPEG, PNG, and WebP are all supported. Upload the highest resolution version available for best quality." },
          { q: "Can I use the transparent PNG on my website?", a: "Yes — the transparent PNG is ready for web, social media, presentations, and any design software." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
