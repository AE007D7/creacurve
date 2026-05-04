import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Logo Design Service | CreaCurve",
  description:
    "Get a professionally designed logo from industry-specialist designers. Starting at $35. 4.9/5 from 1,200+ reviews.",
  openGraph: {
    title: "Professional Logo Design Service | CreaCurve",
    description:
      "Get a professionally designed logo from industry-specialist designers. Starting at $35.",
    type: "website",
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
