import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifySession } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";
import {
  ROADMAP_SEED,
  type ItemStatus,
  type RoadmapPhaseDef,
  type RoadmapSprintDef,
} from "@/lib/roadmap";

export interface ResolvedItem {
  text: string;
  status: ItemStatus;
  autoDetected: boolean;
  detail?: string;
}

export interface ResolvedSection {
  title: string;
  items: ResolvedItem[];
}

export interface ResolvedPhase extends Omit<RoadmapPhaseDef, "sections"> {
  sections: ResolvedSection[];
  done: number;
  total: number;
  percent: number;
}

export interface ResolvedSprint extends Omit<RoadmapSprintDef, "probe"> {
  autoDetected: boolean;
  detail?: string;
}

const OVERRIDES_KEY = "roadmap_overrides";

type Overrides = Record<string, ItemStatus>;

async function getOverrides(): Promise<Overrides> {
  const raw = await getSetting(OVERRIDES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Overrides) : {};
  } catch {
    return {};
  }
}

async function resolveItem(
  item: { text: string; probe?: () => Promise<{ ok: boolean; detail?: string }>; manualStatus?: ItemStatus },
  overrides: Overrides
): Promise<ResolvedItem> {
  if (item.probe) {
    try {
      const r = await item.probe();
      return {
        text: item.text,
        status: r.ok ? "completed" : "pending",
        autoDetected: true,
        detail: r.detail,
      };
    } catch (err) {
      return { text: item.text, status: "pending", autoDetected: true, detail: errMessage(err, "check failed") };
    }
  }
  return {
    text: item.text,
    status: overrides[item.text] ?? item.manualStatus ?? "pending",
    autoDetected: false,
  };
}

async function resolvePhase(phase: RoadmapPhaseDef, overrides: Overrides): Promise<ResolvedPhase> {
  const sections = await Promise.all(
    phase.sections.map(async (section) => ({
      title: section.title,
      items: await Promise.all(section.items.map((i) => resolveItem(i, overrides))),
    }))
  );

  const all = sections.flatMap((s) => s.items);
  const done = all.filter((i) => i.status === "completed").length;
  const total = all.length;

  return {
    num: phase.num,
    title: phase.title,
    subtitle: phase.subtitle,
    goal: phase.goal,
    status: phase.status,
    deliverables: phase.deliverables,
    sections,
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

async function resolveSprint(sprint: RoadmapSprintDef): Promise<ResolvedSprint> {
  const { probe, ...rest } = sprint;
  if (!probe) return { ...rest, autoDetected: false };
  try {
    const r = await probe();
    return { ...rest, status: r.ok ? "completed" : "pending", autoDetected: true, detail: r.detail };
  } catch (err) {
    return { ...rest, status: "pending", autoDetected: true, detail: errMessage(err, "check failed") };
  }
}

export async function GET() {
  const overrides = await getOverrides();
  const [phases, sprints] = await Promise.all([
    Promise.all(ROADMAP_SEED.phases.map((p) => resolvePhase(p, overrides))),
    Promise.all(ROADMAP_SEED.sprints.map(resolveSprint)),
  ]);

  const allItems = phases.flatMap((p) => p.sections.flatMap((s) => s.items));
  const done = allItems.filter((i) => i.status === "completed").length;
  const total = allItems.length;

  return NextResponse.json({
    phases,
    sprints,
    totals: {
      items: total,
      done,
      pending: total - done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
      sprintsDone: sprints.filter((s) => s.status === "completed").length,
      sprintsTotal: sprints.length,
      autoVerified: allItems.filter((i) => i.autoDetected).length,
    },
    syncedAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  // Toggle a single manual item (auto-verified items are read-only).
  if (body?.action === "toggle" && typeof body.text === "string") {
    const overrides = await getOverrides();
    const current = overrides[body.text] ?? "pending";
    const next: ItemStatus = current === "pending" ? "in_progress" : current === "in_progress" ? "completed" : "pending";
    overrides[body.text] = next;
    await setSetting(OVERRIDES_KEY, JSON.stringify(overrides));
    return NextResponse.json({ ok: true, text: body.text, status: next });
  }

  // Reset every manual override back to the seed's declared status.
  if (body?.action === "reset") {
    await setSetting(OVERRIDES_KEY, "{}");
    return NextResponse.json({ ok: true, reset: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
