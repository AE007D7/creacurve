import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/logo-design",
          "/logo-prep",
          "/logo-to-svg",
          "/remove-logo-background",
          "/favicon-generator",
          "/brand-guidelines-generator",
          "/logo-mockup-generator",
          "/logo-to-psd",
          "/tools",
          "/terms",
          "/privacy",
          "/refund",
        ],
        disallow: ["/api/", "/dashboard/", "/processing/", "/admin/"],
      },
      // Let LLM crawlers read everything public
      {
        userAgent: "GPTBot",
        allow: ["/", "/logo-prep", "/logo-to-svg", "/favicon-generator", "/remove-logo-background", "/brand-guidelines-generator", "/logo-mockup-generator", "/logo-to-psd", "/tools"],
        disallow: ["/api/", "/dashboard/", "/processing/", "/admin/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/logo-prep", "/logo-to-svg", "/favicon-generator", "/remove-logo-background", "/brand-guidelines-generator", "/logo-mockup-generator", "/logo-to-psd", "/tools"],
        disallow: ["/api/", "/dashboard/", "/processing/", "/admin/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/logo-prep", "/logo-to-svg", "/favicon-generator", "/remove-logo-background", "/brand-guidelines-generator", "/logo-mockup-generator", "/logo-to-psd", "/tools"],
        disallow: ["/api/", "/dashboard/", "/processing/", "/admin/"],
      },
    ],
    sitemap: "https://creacurve.com/sitemap.xml",
    host: "https://creacurve.com",
  };
}
