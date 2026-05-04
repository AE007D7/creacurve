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

export const metadata: Metadata = {
  verification: {
    google: "a9iSpI2SBxC9-qRdPp0pJ21hJyOHmFd-EaOQwDEnwAw",
  },
  title: "CreaCurve — From logo to launch-ready in 90 seconds",
  description:
    "Upload your logo. Get 60+ professional brand assets — print, web, social, merchandise & more. One-time $29, lifetime access.",
  keywords: ["brand kit", "logo design", "brand identity", "social media templates", "business card", "brand guidelines"],
  authors: [{ name: "CreaCurve" }],
  openGraph: {
    title: "CreaCurve — From logo to launch-ready in 90 seconds",
    description: "Upload your logo. Get 60+ professional brand assets instantly.",
    url: "https://creacurve.com",
    siteName: "CreaCurve",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreaCurve — Brand kit in 90 seconds",
    description: "Upload your logo. Get 60+ brand assets instantly for $29.",
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
