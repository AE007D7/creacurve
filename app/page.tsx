import Nav from "@/components/logo-design/Nav";
import Hero from "@/components/logo-design/Hero";
import LogoMarquee from "@/components/logo-design/LogoMarquee";
import StatsBar from "@/components/logo-design/StatsBar";
import Features from "@/components/logo-design/Features";
import Pricing from "@/components/logo-design/Pricing";
import Portfolio from "@/components/logo-design/Portfolio";
import Industries from "@/components/logo-design/Industries";
import Testimonials from "@/components/logo-design/Testimonials";
import FAQSection from "@/components/logo-design/FAQSection";
import LeadForm from "@/components/logo-design/LeadForm";
import CTAStrip from "@/components/logo-design/CTAStrip";
import ChatWidget from "@/components/logo-design/ChatWidget";
import type { Metadata } from "next";

const BASE = "https://creacurve.com";

export const metadata: Metadata = {
  title: "Professional Logo Design Service — Starting at $35 | CreaCurve",
  description:
    "Get a custom logo from industry-specialist designers in 24–48 hours. Multiple concepts, unlimited revisions, SVG/PNG/PDF files. Trusted by 2,000+ brands. 4.9★ from 1,200+ reviews. Starting at $35.",
  alternates: { canonical: BASE },
  openGraph: {
    title: "Professional Logo Design Service — Starting at $35 | CreaCurve",
    description:
      "Custom logo design from industry specialists. 24–48 hour delivery, unlimited revisions, 4.9★ rated. Starting at $35.",
    url: BASE,
    siteName: "CreaCurve",
    type: "website",
    images: [{ url: `${BASE}/og-logo-design.jpg`, width: 1200, height: 630 }],
  },
};

export default function Home() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Nav />
        <main>
          <Hero />
          <LogoMarquee />
          <StatsBar />
          <Features />
          <section id="pricing">
            <Pricing />
          </section>
          <Portfolio />
          <Industries />
          <Testimonials />
          <FAQSection />
          <LeadForm />
          <CTAStrip />
        </main>
        <ChatWidget />
    </div>
  );
}
