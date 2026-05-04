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

const BASE = "https://creacurve.com";

const schemas = [
  // ── Service ──────────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/logo-design#service`,
    name: "Professional Logo Design Service",
    alternateName: ["Custom Logo Design", "Brand Identity Design", "Graphic Design Service"],
    description:
      "Industry-specialist logo designers create a custom logo for your brand in 24–48 hours. Includes multiple concepts, unlimited revisions on select plans, and delivery in SVG, PNG, PDF and EPS formats.",
    url: `${BASE}/logo-design`,
    provider: {
      "@type": "Organization",
      "@id": `${BASE}#organization`,
      name: "CreaCurve",
      url: BASE,
      logo: `${BASE}/logo.png`,
      sameAs: [
        "https://twitter.com/creacurve",
        "https://www.instagram.com/creacurve",
        "https://www.linkedin.com/company/creacurve",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@creacurve.com",
        availableLanguage: "English",
      },
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Logo Design Plans",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Starter Logo Design",
          description: "4 logo concepts, 2 designers, 4 revisions, JPEG delivery, 24–48 hour turnaround.",
          price: "35.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE}/logo-design#pricing`,
          priceValidUntil: "2026-12-31",
        },
        {
          "@type": "Offer",
          name: "Professional Logo Design",
          description: "12 logo concepts, 4 specialist designers, unlimited revisions, SVG/PNG/PDF/EPS, stationery, email signature, 24–48 hour turnaround.",
          price: "119.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE}/logo-design#pricing`,
          priceValidUntil: "2026-12-31",
        },
        {
          "@type": "Offer",
          name: "Platinum Logo Design",
          description: "Unlimited concepts, 8 designers, unlimited revisions, full brand kit, 500 business cards, priority turnaround.",
          price: "299.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE}/logo-design#pricing`,
          priceValidUntil: "2026-12-31",
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1200",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah Chen" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "The team delivered something I couldn't have imagined myself. The logo perfectly captures what our company stands for.",
        datePublished: "2025-11-10",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Marcus Williams" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "Fast, professional, and incredibly responsive. We had our new brand identity in under 3 days.",
        datePublished: "2025-12-02",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Amara Osei" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "I've worked with design agencies before, but CreaCurve's quality-to-price ratio is in a completely different league.",
        datePublished: "2026-01-14",
      },
    ],
  },

  // ── FAQPage ───────────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does professional logo design cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CreaCurve logo design starts at $35 for the Starter plan (4 concepts, 4 revisions, JPEG). The Professional plan is $119 and includes 12 concepts, unlimited revisions, and vector files (SVG, PDF, EPS). The Platinum plan is $299 and includes unlimited concepts, 8 designers, a full brand kit, and 500 printed business cards.",
        },
      },
      {
        "@type": "Question",
        name: "How long does logo design take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "First logo concepts are delivered in 24–48 hours. Full project completion typically takes 3–7 days depending on revision cycles. Platinum clients receive priority turnaround.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a new logo if my business already has one?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Many of our clients come to us to modernize or completely reinvent their brand identity. We handle rebrands of all sizes.",
        },
      },
      {
        "@type": "Question",
        name: "What file formats will I receive with my logo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You receive SVG, PNG, PDF, and EPS (vector) files, plus web-optimized JPEG and PNG in multiple sizes. All formats are delivered digitally.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my own logo ideas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can share mood boards, sketches, reference logos, or any inspiration, and our designers will bring your vision to life.",
        },
      },
      {
        "@type": "Question",
        name: "What industries does CreaCurve design logos for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CreaCurve serves 45+ industries including Technology, Finance, Healthcare, Education, Real Estate, Food & Beverage, Fashion, Legal, Beauty, Fitness, Gaming, Retail, Architecture, and more. Designers are matched to your specific sector.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a money-back guarantee on logo design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CreaCurve offers a 100% money-back guarantee. If you are not satisfied with the designs, you receive a full refund with no questions asked.",
        },
      },
      {
        "@type": "Question",
        name: "What makes CreaCurve different from other logo design services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CreaCurve matches every project to industry-specialist designers — not generalists. With 10+ years of experience, 24–48 hour turnaround, unlimited revisions on select plans, transparent fixed pricing, and a 4.9/5 rating from 1,200+ reviews, it's built for brands that take design seriously.",
        },
      },
    ],
  },

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: BASE },
      { "@type": "ListItem", position: 2, name: "Logo Design",  item: `${BASE}/logo-design` },
    ],
  },

  // ── WebPage ───────────────────────────────────────────────────────────────
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE}/logo-design#webpage`,
    url: `${BASE}/logo-design`,
    name: "Professional Logo Design Service — Starting at $35 | CreaCurve",
    description:
      "Custom logo design from industry specialists. 24–48 hour delivery, unlimited revisions, 4.9★ rated. Starting at $35.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${BASE}#website` },
    primaryImageOfPage: { url: `${BASE}/og-logo-design.jpg` },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  },
];

export default function LogoDesignPage() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

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
