import type { MetadataRoute } from "next";
import { checkpoints, projects } from "@/content/projects";
import { education } from "@/content/education";
import { siteUrl } from "@/content/site";

// sitemap.xml, built from the content files: a new project / experience / education file gets its page listed automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number) => ({ url: `${siteUrl}${path}`, priority });
  return [
    page("/", 1),
    page("/projects", 0.8),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.6)),
    ...checkpoints.map((c) => page(`/experience/${c.slug}`, 0.6)),
    ...education.map((e) => page(`/education/${e.slug}`, 0.6)),
  ];
}
