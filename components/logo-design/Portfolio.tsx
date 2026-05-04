"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["All", "3D", "Abstract", "Mascot", "Wordmark", "Emblem", "Monogram", "Letterform"] as const;
type Tab = (typeof TABS)[number];

const ALL_ITEMS: { id: number; src: string; tab: Tab }[] = [
  { id: 1,  src: "/logo-examples/logo-1.png",  tab: "Wordmark"   },
  { id: 2,  src: "/logo-examples/logo-2.png",  tab: "Abstract"   },
  { id: 3,  src: "/logo-examples/logo-4.png",  tab: "Emblem"     },
  { id: 4,  src: "/logo-examples/logo-6.png",  tab: "Monogram"   },
  { id: 5,  src: "/logo-examples/logo-7.png",  tab: "Letterform" },
  { id: 6,  src: "/logo-examples/1.jpg",        tab: "3D"         },
  { id: 7,  src: "/logo-examples/2.jpg",        tab: "Abstract"   },
  { id: 8,  src: "/logo-examples/3.jpg",        tab: "Mascot"     },
  { id: 9,  src: "/logo-examples/4.jpg",        tab: "Emblem"     },
  { id: 10, src: "/logo-examples/5.jpg",        tab: "Wordmark"   },
  { id: 11, src: "/logo-examples/6.jpg",        tab: "Monogram"   },
  { id: 12, src: "/logo-examples/7.jpg",        tab: "Letterform" },
  { id: 13, src: "/logo-examples/8.jpg",        tab: "3D"         },
  { id: 14, src: "/logo-examples/9.jpg",        tab: "Abstract"   },
  { id: 15, src: "/logo-examples/10.jpg",       tab: "Mascot"     },
  { id: 16, src: "/logo-examples/11.jpg",       tab: "Emblem"     },
  { id: 17, src: "/logo-examples/12.jpg",       tab: "Wordmark"   },
  { id: 18, src: "/logo-examples/13.jpg",       tab: "Monogram"   },
  { id: 19, src: "/logo-examples/14.jpg",       tab: "Letterform" },
  { id: 20, src: "/logo-examples/15.jpg",       tab: "3D"         },
  { id: 21, src: "/logo-examples/16.jpg",       tab: "Abstract"   },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered =
    activeTab === "All" ? ALL_ITEMS : ALL_ITEMS.filter((item) => item.tab === activeTab);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="portfolio" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Work we&apos;re proud of.
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            A selection of logos designed by our team across every style and industry.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-10 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVisibleCount(8);
              }}
              className={`shrink-0 text-sm font-medium px-3 pb-3 -mb-px transition-all duration-200 focus:outline-none whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400 hover:text-gray-700 border-b-2 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group aspect-square border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={`Logo design — ${item.tab}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 4)}
              className="border border-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
