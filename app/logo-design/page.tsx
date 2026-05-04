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

export default function LogoDesignPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Professional Logo Design Service",
    provider: {
      "@type": "Organization",
      name: "CreaCurve",
      url: "https://creacurve.com",
    },
    description:
      "Get a professionally designed logo from industry-specialist designers. Starting at $35.",
    offers: [
      { "@type": "Offer", name: "Starter Logo Design",       price: "35",  priceCurrency: "USD" },
      { "@type": "Offer", name: "Professional Logo Design",  price: "119", priceCurrency: "USD" },
      { "@type": "Offer", name: "Platinum Logo Design",      price: "299", priceCurrency: "USD" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1200",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
}
