import type { MetadataRoute } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const SITE_URL = "https://lutterodt.org";

const staticRoutes: { path: string; priority: number; lastModified?: string }[] = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/history", priority: 0.8 },
  { path: "/directory", priority: 0.9 },
  { path: "/gallery", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/contribute/consent", priority: 0.5 },
  { path: "/verify", priority: 0.6 },
  { path: "/sponsor", priority: 0.5 },
  { path: "/services", priority: 0.5 },
  { path: "/projects", priority: 0.5 },
  { path: "/reunion-2026", priority: 0.6 },
  { path: "/live", priority: 0.4 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/copyright", priority: 0.3 },
  { path: "/disclaimer", priority: 0.3 },
  { path: "/takedown", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: r.lastModified ?? lastModified,
    changeFrequency: r.path === "" ? "weekly" : "monthly",
    priority: r.priority,
  }));

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    const { results } = await db.prepare(
      "SELECT id FROM outreach_profiles ORDER BY id"
    ).all<{ id: string }>();

    for (const profile of results || []) {
      entries.push({
        url: `${SITE_URL}/directory/${profile.id}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // D1 unavailable at build time — fall back to static routes only.
  }

  return entries;
}