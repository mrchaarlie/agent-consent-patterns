import type { MetadataRoute } from "next";

// Required for `output: "export"` — emit a static robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://agentconsent.dev/sitemap.xml",
  };
}
