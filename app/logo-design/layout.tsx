import type { Metadata } from "next";

const TITLE       = "Professional Logo Design Service — Starting at $35 | CreaCurve";
const DESCRIPTION = "Get a custom logo from industry-specialist designers in 24–48 hours. 12 concepts, unlimited revisions, SVG/PNG/PDF files. Trusted by 2,000+ brands. 4.9★ from 1,200+ reviews. Starting at $35.";
const URL         = "https://creacurve.com/logo-design";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "logo design service",
    "professional logo design",
    "custom logo design",
    "affordable logo design",
    "online logo designer",
    "graphic designer online",
    "logo design for small business",
    "brand identity design",
    "logo design near me",
    "cheap logo design",
    "logo design agency",
    "business logo design",
    "modern logo design",
    "logo and branding",
    "startup logo design",
    "logo design $35",
    "fast logo design",
    "logo design 24 hours",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "CreaCurve",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://creacurve.com/og-logo-design.jpg",
        width: 1200,
        height: 630,
        alt: "CreaCurve Professional Logo Design Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://creacurve.com/og-logo-design.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function LogoDesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white text-gray-900 min-h-screen"
      style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}
    >
      {children}
    </div>
  );
}
