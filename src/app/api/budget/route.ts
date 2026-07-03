import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/pocketbase/settings";

export async function GET() {
  const value = await getSetting("budget");
  if (!value) {
    return NextResponse.json(initialBudget);
  }
  try {
    return NextResponse.json(JSON.parse(value));
  } catch {
    return NextResponse.json(initialBudget);
  }
}

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get("pb_auth");
  if (!authCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSetting("budget", JSON.stringify(body));
  return NextResponse.json(body);
}

const initialBudget = {
  build: [
    { item: "VPS server setup (Hetzner CCX13 — 4 vCPU, 8GB RAM)", cost: 6.50, type: "one-time" },
    { item: "Domain registration (lutterodt.org, 1 year)", cost: 12, type: "one-time" },
    { item: "Cloudflare free tier", cost: 0, type: "one-time" },
    { item: "Development environment & tooling", cost: 0, type: "one-time" },
    { item: "PocketBase setup & configuration", cost: 0, type: "one-time" },
    { item: "SSL certificates (Let's Encrypt, auto)", cost: 0, type: "one-time" },
  ],
  monthly: [
    { item: "VPS server (Hetzner CCX13)", cost: 6.50, type: "monthly" },
    { item: "Domain renewal (amortised)", cost: 1, type: "monthly" },
    { item: "Cloudflare (free tier)", cost: 0, type: "monthly" },
    { item: "Database backups (Cloudflare R2)", cost: 0.07, type: "monthly" },
  ],
  annual: [
    { item: "VPS server (12 months)", cost: 78, type: "annual" },
    { item: "Domain renewal", cost: 12, type: "annual" },
    { item: "Developer maintenance & updates (10 hrs/month @ $50/hr)", cost: 6000, type: "annual" },
    { item: "Content creation & digitisation", cost: 2400, type: "annual" },
    { item: "Contingency (10%)", cost: 849, type: "annual" },
  ],
};
