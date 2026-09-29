import Link from 'next/link';

export function PrintingShell({ children }: { children: React.ReactNode }) {
  return <div className="print-site min-h-screen bg-[#f7f6f2] text-[#182323]">
    <header className="border-b border-[#d9dfd9] bg-[#f7f6f2]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight text-2xl" aria-label="CreaCurve home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#126659] text-white text-xl">C</span>CreaCurve<span className="text-[#b36e34]">.</span></Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm font-semibold"><Link href="/guides" className="hover:text-[#126659]">Guides</Link><Link href="/about" className="hover:text-[#126659]">About</Link><Link href="/contact" className="hover:text-[#126659]">Contact</Link></nav>
      </div>
    </header>
    {children}
    <footer className="mt-20 border-t border-[#d9dfd9] bg-[#edf0e9]"><div className="mx-auto max-w-6xl px-5 py-12"><div className="flex flex-wrap justify-between gap-8"><div><p className="text-xl font-bold">CreaCurve.</p><p className="mt-2 max-w-sm text-sm text-[#53605d]">Practical notes on designing, printing, and improving useful objects.</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-sm"><Link href="/guides">Guides</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav></div><p className="mt-12 text-xs text-[#687572]">© {new Date().getFullYear()} CreaCurve. Verify settings and safety guidance with your printer and material manufacturers.</p></div></footer>
  </div>;
}
