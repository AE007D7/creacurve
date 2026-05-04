"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Can I get a new logo if my business already has one?",
    a: "Absolutely. Many of our clients come to us to modernize or completely reinvent their brand identity.",
  },
  {
    q: "How important is a logo for my brand?",
    a: "A logo is often the first impression of your business. It sets the tone for everything from your website to your packaging.",
  },
  {
    q: "Can I change the logo concepts I get or do I have to select one?",
    a: "You can mix and match elements from different concepts, and request unlimited revisions on Professional and Platinum tiers.",
  },
  {
    q: "Can I use my own logo ideas?",
    a: "Yes. Share mood boards, sketches, or reference logos and our designers will bring your vision to life.",
  },
  {
    q: "Is hiring a professional logo designer helpful?",
    a: "Professional designers bring strategic thinking beyond aesthetics — considering scalability, versatility, and brand longevity.",
  },
  {
    q: "What file formats will I receive?",
    a: "SVG, PNG, PDF, EPS (vector), plus web-optimized JPEG and PNG in multiple sizes.",
  },
  {
    q: "How long does the design process take?",
    a: "First concepts arrive in 24-48 hours. Full completion typically takes 3-7 days depending on revision cycles.",
  },
  {
    q: "What if I'm not satisfied with the designs?",
    a: "We offer unlimited revisions on Professional and Platinum tiers. If you're still unhappy, we offer a 100% money-back guarantee.",
  },
];

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <section id="faq" className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Frequently asked questions.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Everything you need to know about our logo design service. If something&apos;s not
              covered here, just reach out.
            </p>
            <p className="text-sm text-gray-500">
              Still have questions?{" "}
              <a
                href="mailto:hello@creacurve.com"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-700 transition-colors duration-200"
              >
                Email us at hello@creacurve.com
              </a>
            </p>
          </div>

          {/* Right — accordion */}
          <Accordion.Root
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="flex flex-col"
          >
            {FAQS.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="border-b border-gray-200"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between py-5 text-left text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200 focus:outline-none group">
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0 text-gray-500 group-data-[state=open]:hidden">
                      <Plus size={16} strokeWidth={1.75} />
                    </span>
                    <span className="ml-4 shrink-0 text-gray-500 hidden group-data-[state=open]:block">
                      <X size={16} strokeWidth={1.75} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
