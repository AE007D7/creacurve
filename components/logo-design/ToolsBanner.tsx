import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";

export default function ToolsBanner() {
  return (
    <section className="py-10 bg-violet-50 border-y border-violet-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)" }}>
              <Wand2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Already have an AI logo?
              </p>
              <p className="text-sm text-gray-500">
                Remove the background, get 5 PNG variants + a Brand Guidelines PDF — free.
              </p>
            </div>
          </div>
          <Link
            href="/logo-prep"
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white whitespace-nowrap transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" }}
          >
            Try the free tool
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
