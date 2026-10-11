import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { CHECK_CATEGORIES, CheckItemDef } from "@/lib/checks";

interface CheckItemResponse {
  text: string;
  status: "pending" | "completed";
  autoDetected: boolean;
  detail?: string;
}

interface CheckCategoryResponse {
  title: string;
  items: CheckItemResponse[];
}

async function runChecks(): Promise<CheckCategoryResponse[]> {
  const overridesRaw = await getSetting("prelaunch_overrides");
  const overrides: Record<string, "pending" | "completed"> = overridesRaw
    ? JSON.parse(overridesRaw)
    : {};

  const results: CheckCategoryResponse[] = [];

  for (const cat of CHECK_CATEGORIES) {
    const items: CheckItemResponse[] = await Promise.all(
      cat.items.map(async (item: CheckItemDef) => {
        if (item.check) {
          try {
            const r = await item.check();
            return {
              text: item.text,
              status: r.ok ? "completed" : "pending",
              autoDetected: true,
              detail: r.detail,
            };
          } catch {
            return { text: item.text, status: "pending", autoDetected: true };
          }
        }
        const manual = overrides[item.text] || item.manualStatus || "pending";
        return { text: item.text, status: manual, autoDetected: false };
      })
    );
    results.push({ title: cat.title, items });
  }

  return results;
}

export async function GET() {
  const data = await runChecks();
  const total = data.reduce((s, c) => s + c.items.length, 0);
  const done = data.reduce((s, c) => s + c.items.filter((i) => i.status === "completed").length, 0);
  return NextResponse.json({ categories: data, total, done, checkedAt: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  if (body.action === "toggle" && body.text) {
    const overridesRaw = await getSetting("prelaunch_overrides");
    const overrides: Record<string, "pending" | "completed"> = overridesRaw
      ? JSON.parse(overridesRaw)
      : {};
    overrides[body.text] = body.status;
    await setSetting("prelaunch_overrides", JSON.stringify(overrides));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
