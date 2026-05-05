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
  { id: 21, src: "/logo-examples/16.jpg",        tab: "Abstract"   },

  // examples2
  { id: 22, src: "/logo-examples/16_1.webp",    tab: "3D"         },
  { id: 23, src: "/logo-examples/18_2.webp",    tab: "Abstract"   },
  { id: 24, src: "/logo-examples/19_3.webp",    tab: "Mascot"     },
  { id: 25, src: "/logo-examples/20_4.webp",    tab: "Emblem"     },
  { id: 26, src: "/logo-examples/21_5.webp",    tab: "Wordmark"   },
  { id: 27, src: "/logo-examples/22_6.webp",    tab: "Monogram"   },
  { id: 28, src: "/logo-examples/23_7.webp",    tab: "Letterform" },
  { id: 29, src: "/logo-examples/24_8.webp",    tab: "3D"         },
  { id: 30, src: "/logo-examples/25_9.webp",    tab: "Abstract"   },
  { id: 31, src: "/logo-examples/26_10.webp",   tab: "Mascot"     },
  { id: 32, src: "/logo-examples/27_11.webp",   tab: "Emblem"     },
  { id: 33, src: "/logo-examples/28_12.webp",   tab: "Wordmark"   },
  { id: 34, src: "/logo-examples/29_1.webp",    tab: "Monogram"   },
  { id: 35, src: "/logo-examples/30_2.webp",    tab: "Letterform" },
  { id: 36, src: "/logo-examples/31_3.webp",    tab: "3D"         },
  { id: 37, src: "/logo-examples/32_4.webp",    tab: "Abstract"   },
  { id: 38, src: "/logo-examples/33_5.webp",    tab: "Mascot"     },
  { id: 39, src: "/logo-examples/34_6.webp",    tab: "Emblem"     },
  { id: 40, src: "/logo-examples/35_7.webp",    tab: "Wordmark"   },
  { id: 41, src: "/logo-examples/36_8.webp",    tab: "Monogram"   },
  { id: 42, src: "/logo-examples/37_9.webp",    tab: "Letterform" },
  { id: 43, src: "/logo-examples/38_10.webp",   tab: "3D"         },
  { id: 44, src: "/logo-examples/39_11.webp",   tab: "Abstract"   },
  { id: 45, src: "/logo-examples/40_12.webp",   tab: "Mascot"     },
  { id: 46, src: "/logo-examples/41_1.webp",    tab: "Emblem"     },
  { id: 47, src: "/logo-examples/42_2.webp",    tab: "Wordmark"   },
  { id: 48, src: "/logo-examples/43_3.webp",    tab: "Monogram"   },
  { id: 49, src: "/logo-examples/44_4.webp",    tab: "Letterform" },
  { id: 50, src: "/logo-examples/45_5.webp",    tab: "3D"         },
  { id: 51, src: "/logo-examples/46_6.webp",    tab: "Abstract"   },
  { id: 52, src: "/logo-examples/47_7.webp",    tab: "Mascot"     },
  { id: 53, src: "/logo-examples/48_8.webp",    tab: "Emblem"     },
  { id: 54, src: "/logo-examples/49_9.webp",    tab: "Wordmark"   },
  { id: 55, src: "/logo-examples/50_10.webp",   tab: "Monogram"   },
  { id: 56, src: "/logo-examples/51_11.webp",   tab: "Letterform" },
  { id: 57, src: "/logo-examples/52_12.webp",   tab: "3D"         },
  { id: 58, src: "/logo-examples/53_1.webp",    tab: "Abstract"   },
  { id: 59, src: "/logo-examples/54_2.webp",    tab: "Mascot"     },
  { id: 60, src: "/logo-examples/55_3.webp",    tab: "Emblem"     },
  { id: 61, src: "/logo-examples/56_4.webp",    tab: "Wordmark"   },
  { id: 62, src: "/logo-examples/57_5.webp",    tab: "Monogram"   },
  { id: 63, src: "/logo-examples/58_6.webp",    tab: "Letterform" },
  { id: 64, src: "/logo-examples/59_7.webp",    tab: "3D"         },
  { id: 65, src: "/logo-examples/60_8.webp",    tab: "Abstract"   },
  { id: 66, src: "/logo-examples/61_9.webp",    tab: "Mascot"     },
  { id: 67, src: "/logo-examples/62_10.webp",   tab: "Emblem"     },
  { id: 68, src: "/logo-examples/63_11.webp",   tab: "Wordmark"   },
  { id: 69, src: "/logo-examples/64_12.webp",   tab: "Monogram"   },
  { id: 70, src: "/logo-examples/65_1.webp",    tab: "Letterform" },
  { id: 71, src: "/logo-examples/66_2.webp",    tab: "3D"         },
  { id: 72, src: "/logo-examples/67_3.webp",    tab: "Abstract"   },
  { id: 73, src: "/logo-examples/68_4.webp",    tab: "Mascot"     },
  { id: 74, src: "/logo-examples/69_5.webp",    tab: "Emblem"     },
  { id: 75, src: "/logo-examples/70_6.webp",    tab: "Wordmark"   },
  { id: 76, src: "/logo-examples/71_7.webp",    tab: "Monogram"   },
  { id: 77, src: "/logo-examples/72_8.webp",    tab: "Letterform" },
  { id: 78, src: "/logo-examples/73_9.webp",    tab: "3D"         },
  { id: 79, src: "/logo-examples/74_10.webp",   tab: "Abstract"   },
  { id: 80, src: "/logo-examples/75_11.webp",   tab: "Mascot"     },
  { id: 81, src: "/logo-examples/76_12.webp",   tab: "Emblem"     },
  { id: 82, src: "/logo-examples/77_1.webp",    tab: "Wordmark"   },
  { id: 83, src: "/logo-examples/78_2.webp",    tab: "Monogram"   },
  { id: 84, src: "/logo-examples/79_3.webp",    tab: "Letterform" },
  { id: 85, src: "/logo-examples/80_4.webp",    tab: "3D"         },
  { id: 86, src: "/logo-examples/81_5.webp",    tab: "Abstract"   },
  { id: 87, src: "/logo-examples/82_6.webp",    tab: "Mascot"     },
  { id: 88, src: "/logo-examples/83_7.webp",    tab: "Emblem"     },
  { id: 89, src: "/logo-examples/84_8.webp",    tab: "Wordmark"   },
  { id: 90, src: "/logo-examples/85_9.webp",    tab: "Monogram"   },
  { id: 91, src: "/logo-examples/86_10.webp",   tab: "Letterform" },
  { id: 92, src: "/logo-examples/87_11.webp",   tab: "3D"         },
  { id: 93, src: "/logo-examples/88_12.webp",   tab: "Abstract"   },
  { id: 94, src: "/logo-examples/89_1.webp",    tab: "Mascot"     },
  { id: 95, src: "/logo-examples/90_2.webp",    tab: "Emblem"     },
  { id: 96, src: "/logo-examples/91_3.webp",    tab: "Wordmark"   },
  { id: 97, src: "/logo-examples/92_4.webp",    tab: "Monogram"   },
  { id: 98, src: "/logo-examples/93_5.webp",    tab: "Letterform" },
  { id: 99, src: "/logo-examples/94_6.webp",    tab: "3D"         },
  { id: 100, src: "/logo-examples/95_7.webp",   tab: "Abstract"   },
  { id: 101, src: "/logo-examples/96_8.webp",   tab: "Mascot"     },
  { id: 102, src: "/logo-examples/97_9.webp",   tab: "Emblem"     },
  { id: 103, src: "/logo-examples/98_10.webp",  tab: "Wordmark"   },
  { id: 104, src: "/logo-examples/99_11.webp",  tab: "Monogram"   },
  { id: 105, src: "/logo-examples/100_12.webp", tab: "Letterform" },
  { id: 106, src: "/logo-examples/101_1.webp",  tab: "3D"         },
  { id: 107, src: "/logo-examples/102_2.webp",  tab: "Abstract"   },
  { id: 108, src: "/logo-examples/103_3.webp",  tab: "Mascot"     },
  { id: 109, src: "/logo-examples/104_4.webp",  tab: "Emblem"     },
  { id: 110, src: "/logo-examples/105_5.webp",  tab: "Wordmark"   },
  { id: 111, src: "/logo-examples/106_6.webp",  tab: "Monogram"   },
  { id: 112, src: "/logo-examples/107_7.webp",  tab: "Letterform" },
  { id: 113, src: "/logo-examples/108_8.webp",  tab: "3D"         },
  { id: 114, src: "/logo-examples/109_9.webp",  tab: "Abstract"   },
  { id: 115, src: "/logo-examples/110_10.webp", tab: "Mascot"     },
  { id: 116, src: "/logo-examples/111_11.webp", tab: "Emblem"     },
  { id: 117, src: "/logo-examples/112_12.webp", tab: "Wordmark"   },
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
