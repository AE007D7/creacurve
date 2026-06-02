import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/logo-to-svg`;

export const metadata: Metadata = {
  title: "Free Logo to SVG Converter — Online, Instant, No Sign-up | CreaCurve",
  description: "Convert any logo PNG or JPEG to SVG format free online. Paste your logo, get an SVG file + 18 other professional formats in one ZIP. No account required.",
  keywords: ["logo to svg", "convert logo to svg", "logo svg converter", "png to svg logo", "logo svg free", "logo vector converter"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Logo to SVG Converter", description: "Convert your logo to SVG + 18 other formats instantly. Free online tool.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Logo to SVG Converter",
  description: "Free online tool to convert any logo PNG or JPEG to SVG format. Also exports PSD, PDF, AI, transparent PNG, favicons, and brand guidelines.",
  url: URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", "@id": `${BASE}#organization`, name: "CreaCurve" },
};

const RELATED = [
  { label: "Remove Logo Background", href: "/remove-logo-background", desc: "Get transparent PNG from any logo" },
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
        headline: "Convert Your Logo to SVG — Free",
        subheadline: "Upload any PNG or JPEG logo and download a proper SVG file in seconds. Compatible with Adobe Illustrator, Figma, Inkscape, and all browsers. Plus 18 other formats in one ZIP.",
        badge: "Free SVG Converter",
        ctaLabel: "Convert to SVG Free",
        heroFeatures: ["SVG 1.1 standard", "Illustrator compatible", "Figma & Inkscape ready", "No account needed", "18 bonus formats"],
        outputFiles: [
          { label: "logo.svg", desc: "SVG 1.1 vector container, embed-ready for any tool" },
          { label: "logo-transparent.png", desc: "Transparent PNG as bonus" },
          { label: "logo-black.png", desc: "Black silhouette variant" },
          { label: "logo-white.png", desc: "White silhouette variant" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo.psd", desc: "Photoshop flat RGBA document" },
          { label: "logo.ai", desc: "Adobe Illustrator compatible" },
          { label: "favicon-16/32/192.png", desc: "Browser & PWA favicons" },
          { label: "brand-guidelines.pdf", desc: "5-page brand style guide" },
          { label: "copyright-certificate.pdf", desc: "Ownership certificate" },
          { label: "mockup-3d-card.png", desc: "3D card mockup" },
          { label: "mockup-wall-3d.png", desc: "3D wall mockup" },
        ],
        howItWorks: [
          { step: "1", title: "Upload your logo", desc: "Drag & drop any PNG, JPEG, or WebP logo file." },
          { step: "2", title: "We generate everything", desc: "SVG, PSD, PDF, AI, favicons, brand guide — all processed in ~20 seconds." },
          { step: "3", title: "Download the ZIP", desc: "One click downloads all 19 files including your SVG." },
        ],
        faqs: [
          { q: "Can I really convert a PNG logo to SVG for free?", a: "Yes — the CreaCurve Logo Prep Tool is free for your first use. It wraps your logo pixel data in a proper SVG 1.1 container with correct viewBox, preserveAspectRatio, and xlink:href embedding. For a pixel-to-vector trace, we recommend also using Inkscape's Path > Trace Bitmap after downloading." },
          { q: "Is the SVG compatible with Adobe Illustrator?", a: "Yes. The generated SVG uses SVG 1.1 standard that opens in Illustrator CS4+, Inkscape, Figma, Sketch, and all modern web browsers." },
          { q: "What's the difference between a raster and vector SVG?", a: "The SVG file we generate embeds your logo as a high-resolution image inside an SVG container. This makes it infinitely scalable for web use and compatible with all design tools. For a true vector trace (anchor points), you'd need to use Inkscape or Illustrator's tracing feature afterward." },
          { q: "How long does it take?", a: "About 15–25 seconds to process and generate all 19 files." },
          { q: "Do I need an account?", a: "No account, no email, no credit card. Upload, generate, download." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
