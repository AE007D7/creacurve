import type { MetadataRoute } from "next";

const BASE = "https://creacurve.com";
const NOW  = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ────────────────────────────────────────────────────────
    { url: BASE,                                  lastModified: NOW, changeFrequency: "weekly",  priority: 1.0  },
    { url: `${BASE}/logo-design`,                 lastModified: NOW, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE}/logo-prep`,                   lastModified: NOW, changeFrequency: "weekly",  priority: 0.95 },

    // ── Free tool landing pages (programmatic SEO) ────────────────────────
    { url: `${BASE}/logo-to-svg`,                 lastModified: NOW, changeFrequency: "monthly", priority: 0.9  },
    { url: `${BASE}/remove-logo-background`,      lastModified: NOW, changeFrequency: "monthly", priority: 0.9  },
    { url: `${BASE}/favicon-generator`,           lastModified: NOW, changeFrequency: "monthly", priority: 0.9  },
    { url: `${BASE}/brand-guidelines-generator`,  lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/logo-mockup-generator`,       lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/logo-to-psd`,                 lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },

    // ── Hub ───────────────────────────────────────────────────────────────
    { url: `${BASE}/tools`,                       lastModified: NOW, changeFrequency: "monthly", priority: 0.8  },

    // ── Legal ─────────────────────────────────────────────────────────────
    { url: `${BASE}/terms`,                       lastModified: NOW, changeFrequency: "yearly",  priority: 0.3  },
    { url: `${BASE}/privacy`,                     lastModified: NOW, changeFrequency: "yearly",  priority: 0.3  },
    { url: `${BASE}/refund`,                      lastModified: NOW, changeFrequency: "yearly",  priority: 0.3  },
  ];
}
