import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/logo-design", "/create"],
        disallow: ["/api/", "/dashboard/", "/processing/"],
      },
    ],
    sitemap: "https://creacurve.com/sitemap.xml",
    host: "https://creacurve.com",
  };
}
