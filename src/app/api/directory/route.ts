import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { errMessage } from "@/lib/utils";
import { categoryLabels } from "@/lib/category-labels";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const { results } = await db.prepare(
      "SELECT id, name, dob, category, country, achievement FROM outreach_profiles ORDER BY name"
    ).all<{ id: string; name: string; dob: string; category: string; country: string; achievement: string }>();

    let cookieStore;
    try { cookieStore = await cookies(); } catch { cookieStore = null; }
    const isVerified = cookieStore?.get("lutterodt_verified")?.value === "true";

    const profiles = (results || []).map((p) => ({
      id: p.id, name: p.name, dob: p.dob, category: p.category,
      country: p.country, achievement: p.achievement,
    }));

    const historicalProfiles = profiles.filter((p) => p.category === "historical");
    const countries = Array.from(new Set(profiles.map((p) => p.country))).sort();
    const categories = Object.keys(categoryLabels);
    const continents = ["Africa", "Europe", "North America", "South America", "Asia", "Oceania"];

    return NextResponse.json({
      profiles: isVerified ? profiles : historicalProfiles,
      totalProfiles: profiles.length,
      livingProfiles: profiles.filter((p) => p.category !== "historical").length,
      countries,
      categories,
      continents,
      isVerified,
      categoryLabels,
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
