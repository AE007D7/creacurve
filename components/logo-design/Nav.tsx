"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Pricing", id: "pricing" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Reviews", id: "reviews" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        scrolled ? "border-b border-gray-200 shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Crea
            <span
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Curve
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollTo("lead-form")}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
          >
            Get started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-5 flex flex-col gap-4">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                scrollTo(link.id);
                setMobileOpen(false);
              }}
              className="text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 py-1 focus:outline-none"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              scrollTo("lead-form");
              setMobileOpen(false);
            }}
            className="mt-1 text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
          >
            Get started
          </button>
        </div>
      )}
    </header>
  );
}
