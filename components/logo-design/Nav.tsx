"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { openChat } from "@/lib/chat";

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

        {/* Legal dropdown */}
        <div className="hidden md:block relative group">
          <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 focus:outline-none">
            Legal <ChevronDown size={14} />
          </button>
          <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <Link href="/terms"   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of Service</Link>
            <Link href="/privacy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy Policy</Link>
            <Link href="/refund"  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Refund Policy</Link>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/12522198026"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            style={{ background: "#25D366" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <button
            onClick={openChat}
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
          <a
            href="https://wa.me/12522198026"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-1 text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            style={{ background: "#25D366" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
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

          {/* Mobile legal links */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <Link href="/terms"   onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-gray-700 py-0.5">Terms of Service</Link>
            <Link href="/privacy" onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-gray-700 py-0.5">Privacy Policy</Link>
            <Link href="/refund"  onClick={() => setMobileOpen(false)} className="text-xs text-gray-400 hover:text-gray-700 py-0.5">Refund Policy</Link>
          </div>
        </div>
      )}
    </header>
  );
}
