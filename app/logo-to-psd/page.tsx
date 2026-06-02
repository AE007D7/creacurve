import ToolLandingPage from "@/components/seo-landing/ToolLandingPage";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";
const URL  = `${BASE}/logo-to-psd`;

export const metadata: Metadata = {
  title: "Free Logo to PSD Converter — Photoshop File Download | CreaCurve",
  description: "Convert any PNG or JPEG logo to a Photoshop PSD file free online. Opens in Photoshop CS4+, Affinity Photo, and GIMP. No Photoshop required to create it. Instant download.",
  keywords: ["logo to psd", "convert logo to psd", "png to psd converter", "logo photoshop file", "psd file generator", "logo to photoshop free"],
  alternates: { canonical: URL },
  openGraph: { title: "Free Logo to PSD Converter", description: "Convert your logo PNG to a Photoshop PSD file. Free, instant, no account.", url: URL, siteName: "CreaCurve", type: "website" },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CreaCurve Logo to PSD Converter",
  description: "Free online tool to convert any logo PNG or JPEG to a Photoshop PSD file. Opens in Photoshop CS4+, Affinity Photo, and GIMP.",
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
  { label: "Logo Mockup Generator", href: "/logo-mockup-generator", desc: "3D card, wall & brand board mockups" },
  { label: "All Logo Files (ZIP)", href: "/logo-prep", desc: "All 19 formats in one download" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <ToolLandingPage config={{
        headline: "Convert Your Logo to PSD — Free",
        subheadline: "Upload any PNG or JPEG logo and download a Photoshop PSD file instantly. No Photoshop needed to create it — just open it in PS, Affinity Photo, or GIMP when you need to edit it.",
        badge: "Free PSD Converter",
        ctaLabel: "Convert to PSD Free",
        heroFeatures: ["Flat RGBA Photoshop file", "Opens in Photoshop CS4+", "Affinity Photo compatible", "GIMP compatible", "18 bonus formats"],
        outputFiles: [
          { label: "logo.psd", desc: "Flat RGBA Photoshop document" },
          { label: "logo.ai", desc: "Adobe Illustrator compatible file" },
          { label: "logo.svg", desc: "SVG vector container" },
          { label: "logo.pdf", desc: "Print-ready 2-page PDF" },
          { label: "logo-transparent.png", desc: "Transparent PNG" },
          { label: "logo-black.png", desc: "Black silhouette variant" },
          { label: "logo-white.png", desc: "White silhouette variant" },
          { label: "logo-on-white.png", desc: "Logo on white background" },
          { label: "logo-on-dark.png", desc: "Logo on dark background" },
          { label: "favicon-16/32/192.png", desc: "Browser & PWA favicons" },
          { label: "brand-guidelines.pdf", desc: "5-page brand style guide" },
          { label: "mockup-3d-card.png", desc: "3D card mockup" },
        ],
        howItWorks: [
          { step: "1", title: "Upload your logo", desc: "Drag & drop any PNG, JPEG, or WebP logo file." },
          { step: "2", title: "PSD is generated", desc: "We create a flat Photoshop document with full RGBA pixel data from your logo." },
          { step: "3", title: "Download the ZIP", desc: "Get logo.psd plus 18 other professional brand files in one ZIP." },
        ],
        faqs: [
          { q: "What version of Photoshop can open this PSD?", a: "The generated PSD uses the Photoshop 3 format and opens in Photoshop CS4 and newer, Affinity Photo 1.x and 2.x, GIMP 2.10+, and Pixelmator Pro." },
          { q: "Is it a flat PSD or does it have layers?", a: "It is a flat PSD — a single merged layer with the full RGBA pixel data of your logo. For a layered PSD with vector paths, you would need to work in Photoshop directly after opening the file." },
          { q: "Do I need Photoshop to create the PSD?", a: "No — the PSD is created by our server. You only need Photoshop (or an alternative like Affinity Photo or GIMP) to open and edit it." },
          { q: "Why would I need a PSD of my logo?", a: "Designers often request logos in PSD format for compositing — placing your logo on backgrounds, mockups, or marketing materials in Photoshop. It preserves the full-resolution pixel data with transparency." },
          { q: "Is the converter free?", a: "Yes — first use is completely free. No account, no watermark, no credit card." },
        ],
        relatedTools: RELATED,
      }} />
    </>
  );
}
