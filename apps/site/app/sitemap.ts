import type { MetadataRoute } from "next";
import { TOPICS } from "@/lib/research";
import { PATTERNS } from "@/lib/patterns";

// Required for `output: "export"` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

// Absolute base — sitemap entries must be fully-qualified URLs. Kept in step
// with metadataBase in app/layout.tsx.
const BASE = "https://agentconsent.dev";

// trailingSlash: true (next.config.mjs) → every route is emitted with a
// trailing slash; match that here so the sitemap URLs are canonical.
const ROUTES = [
  "/",
  "/patterns/",
  "/library/",
  "/skill/",
  "/principles/",
  "/about/",
  "/research/",
  ...PATTERNS.filter((p) => p.status === "live").map(
    (p) => `/patterns/${p.slug}/`,
  ),
  ...TOPICS.map((t) => `/research/${t.slug}/`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified,
  }));
}
