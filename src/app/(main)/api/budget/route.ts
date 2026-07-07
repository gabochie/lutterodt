import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifySession } from "@/lib/cf/auth";

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
  if (!(await verifySession())) {
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
    { item: "Cloudflare KV + D1 setup", cost: 0, type: "one-time" },
    { item: "SSL certificates (Let's Encrypt, auto)", cost: 0, type: "one-time" },
  ],
  monthly: [
    { item: "Cloudflare Workers (free tier)", cost: 0, type: "monthly" },
    { item: "D1 database (free tier — 5M rows/month)", cost: 0, type: "monthly" },
    { item: "KV storage (free tier — 1GB stored)", cost: 0, type: "monthly" },
    { item: "Domain renewal (amortised)", cost: 1, type: "monthly" },
  ],
  annual: [
    { item: "Domain renewal", cost: 12, type: "annual" },
    { item: "Developer maintenance & updates (10 hrs/month @ $50/hr)", cost: 6000, type: "annual" },
    { item: "Content creation & digitisation", cost: 2400, type: "annual" },
    { item: "Contingency (10%)", cost: 849, type: "annual" },
  ],
};
