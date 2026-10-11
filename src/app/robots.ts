import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    // Vorschau/Test: komplett gesperrt
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
