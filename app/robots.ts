import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

// robots.txt: everything may be crawled; the sitemap lists the pages.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
