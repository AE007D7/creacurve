import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const BASE        = "https://creacurve.com";
const TITLE       = "CreaCurve — Brand Kit Generator: 60+ Assets in 90 Seconds";
const DESCRIPTION = "Upload your logo and get 60+ professional brand assets instantly — business cards, social media templates, mockups, merchandise & more. One-time $29, lifetime access.";
const OG_IMAGE    = `${BASE}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: TITLE,
    template: "%s | CreaCurve",
  },
  description: DESCRIPTION,
  keywords: [
    "brand kit generator",
    "brand assets",
    "logo to brand kit",
    "social media templates",
    "business card design",
    "brand identity",
    "brand guidelines",
    "logo design",
    "brand mockups",
    "visual identity",
  ],
  authors: [{ name: "CreaCurve", url: BASE }],
  creator: "CreaCurve",
  publisher: "CreaCurve",
  alternates: {
    canonical: BASE,
  },
  verification: {
    google: "a9iSpI2SBxC9-qRdPp0pJ21hJyOHmFd-EaOQwDEnwAw",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE,
    siteName: "CreaCurve",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CreaCurve — Brand Kit Generator",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@creacurve",
    creator: "@creacurve",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18137575324"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18137575324');
          `}
        </Script>
      </head>
      <body className="w-full min-h-screen bg-[#0a0a0a] text-[#fafafa] antialiased font-sans overflow-x-hidden">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(20,20,20,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafafa",
            },
          }}
        />
      </body>
    </html>
  );
}
