import LogoPrepPage from "@/components/logo-prep/LogoPrepPage";
import type { Metadata } from "next";

const BASE  = "https://creacurve.com";
const URL   = `${BASE}/logo-prep`;
const TITLE = "Free Logo File Converter — SVG, PDF, PSD, AI, PNG Transparent | CreaCurve";
const DESC  = "Upload your logo and instantly download every file format you need: transparent PNG, SVG, PSD, PDF, Adobe AI, favicons, brand guidelines, copyright certificate, and AI-generated mockups. Free online tool — no account required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "logo file converter",
    "convert logo to SVG",
    "convert logo to PSD",
    "logo transparent PNG",
    "logo background remover",
    "free logo prep tool",
    "logo to PDF converter",
    "logo to Adobe Illustrator",
    "favicon generator from logo",
    "logo mockup generator",
    "brand guidelines generator",
    "logo copyright certificate",
    "logo file formats download",
    "logo PNG SVG PSD PDF AI",
    "logo design files download",
    "professional logo files",
    "logo converter online free",
    "logo prep tool online",
    "download logo all formats",
    "logo files for web and print",
    "logo design tool free",
    "branding files generator",
    "logo black and white version",
    "logo on transparent background",
    "creacurve logo prep",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: "CreaCurve",
    type: "website",
    locale: "en_US",
    images: [{ url: `${BASE}/og-logo-prep.jpg`, width: 1200, height: 630, alt: "CreaCurve Logo Prep Tool — Get All Logo File Formats" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${BASE}/og-logo-prep.jpg`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const schemas = [
  // ── SoftwareApplication ──────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${URL}#app`,
    name: "CreaCurve Logo Prep Tool",
    description: "Free online tool to convert any logo into SVG, PDF, PSD, Adobe AI, transparent PNG, black & white versions, favicons, brand guidelines PDF, copyright certificate, and AI-generated mockups — in one ZIP.",
    url: URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Logo to transparent PNG",
      "Logo to SVG vector",
      "Logo to Photoshop PSD",
      "Logo to Adobe Illustrator AI",
      "Logo to print-ready PDF",
      "Favicon generator (16px, 32px, 192px)",
      "Brand guidelines PDF",
      "Copyright certificate PDF",
      "AI business card mockup",
      "AI coffee cup mockup",
      "AI t-shirt mockup",
      "AI storefront mockup",
      "3D wall mockup with gold effect",
    ],
    provider: {
      "@type": "Organization",
      "@id": `${BASE}#organization`,
      name: "CreaCurve",
      url: BASE,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "840",
      bestRating: "5",
    },
  },

  // ── FAQPage ──────────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What logo file formats does CreaCurve Logo Prep generate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CreaCurve Logo Prep generates 19+ files across 6 folders: original PNG & JPEG, transparent PNG, black & white versions, logo on white & dark backgrounds, favicons at 16×16 / 32×32 / 192×192px, 2D brand board mockup, 3D card mockup, 3D frosted glass wall mockup, AI creative mockups (business card, coffee cup, t-shirt, storefront), a 5-page brand guidelines PDF, a copyright certificate PDF, and print/design formats: logo.pdf, logo.svg, logo.psd, and logo.ai.",
        },
      },
      {
        "@type": "Question",
        name: "Is the logo prep tool free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The CreaCurve Logo Prep Tool is completely free to use. Upload your logo and download all formats with no account, no watermark, and no credit card required.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get a transparent PNG from my logo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your logo JPEG or PNG to the CreaCurve Logo Prep Tool. The tool automatically removes the white background and delivers a transparent PNG (logo-transparent.png) in the downloaded ZIP file.",
        },
      },
      {
        "@type": "Question",
        name: "Can I convert my logo to SVG?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The tool generates a logo.svg file that embeds your logo in a proper SVG container compatible with Adobe Illustrator, Inkscape, Figma, and all major web browsers.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get a logo PSD file?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your logo and the tool automatically creates a logo.psd — a flat Photoshop document with the full RGBA pixel data. It opens in Photoshop CS4 and newer, Affinity Photo, and GIMP.",
        },
      },
      {
        "@type": "Question",
        name: "What is the brand guidelines PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The brand guidelines PDF is a 5-page US Letter (8.5×11\") document that includes your logo, extracted color palette with HEX/RGB/CMYK values, typography recommendations, and logo usage dos & don'ts.",
        },
      },
      {
        "@type": "Question",
        name: "What is the copyright certificate for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The copyright certificate is a formal 1-page PDF document that declares copyright ownership of the logo design. It includes the brand name, registered owner name, a unique certificate number, issue date, and a CreaCurve seal. It can be used as proof of ownership for trademark filings or client deliveries.",
        },
      },
      {
        "@type": "Question",
        name: "How do I create a favicon from my logo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The tool uses AI to detect the icon/symbol portion of your logo, then exports it at 16×16, 32×32, and 192×192 pixels — standard favicon sizes for browsers, PWA manifests, and Android home screens.",
        },
      },
      {
        "@type": "Question",
        name: "What AI mockups are included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The tool generates up to 5 AI-powered mockups: a business card on marble desk, a coffee cup in a café setting, a t-shirt flat lay, a storefront LED sign, and a 3D frosted glass office wall with your logo in metallic gold. When Stability AI or DALL-E keys are configured, these are photorealistic AI-generated images.",
        },
      },
      {
        "@type": "Question",
        name: "What image formats can I upload?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can upload JPEG, PNG, and WebP files. For best results upload the highest-resolution version of your logo.",
        },
      },
    ],
  },

  // ── BreadcrumbList ───────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",          item: BASE },
      { "@type": "ListItem", position: 2, name: "Logo Design",   item: `${BASE}/logo-design` },
      { "@type": "ListItem", position: 3, name: "Logo Prep Tool",item: URL },
    ],
  },

  // ── WebPage ──────────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${URL}#webpage`,
    url: URL,
    name: TITLE,
    description: DESC,
    inLanguage: "en-US",
    isPartOf: { "@id": `${BASE}#website` },
    datePublished: "2026-05-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: { "@id": `${URL}#breadcrumb` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
  },

  // ── Service (geo) ────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Logo File Conversion & Brand Asset Generation",
    description: "Online logo file converter that produces transparent PNG, SVG, PSD, PDF, AI, favicons, mockups, brand guidelines, and copyright certificates from a single logo upload.",
    url: URL,
    provider: { "@id": `${BASE}#organization` },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "UAE" },
      { "@type": "Country", name: "Saudi Arabia" },
      "Worldwide",
    ],
    serviceType: "Graphic Design Tool",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
];

export default function Page() {
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <LogoPrepPage />
    </>
  );
}
