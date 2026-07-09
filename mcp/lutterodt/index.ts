import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(): string {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  const dotVars = resolve(__dirname, "../../.dev.vars");
  if (existsSync(dotVars)) {
    const raw = readFileSync(dotVars, "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0 && trimmed.slice(0, eq).trim() === "CRON_SECRET") {
        return trimmed.slice(eq + 1).trim();
      }
    }
  }
  return "";
}

const BASE_URL = process.env.LUTTERODT_URL || "https://lutterodt.org";
const CRON_SECRET = loadEnv();

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (CRON_SECRET) h["Authorization"] = `Bearer ${CRON_SECRET}`;
  return h;
}

async function apiGet(path: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

async function apiPost(path: string, body?: any): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

const server = new McpServer({
  name: "lutterodt",
  version: "1.0.0",
});

// ── Read tools ────────────────────────────────────────

server.registerTool("list_profiles", {
  description: "List Lutterodt outreach profiles with optional filters",
  inputSchema: z.object({
    search: z.string().optional().describe("Search term to filter profiles"),
    category: z.string().optional().describe("Category filter (e.g. Business, Academia, Healthcare)"),
    country: z.string().optional().describe("Country filter (e.g. Ghana, UK, USA)"),
    letter_status: z.string().optional().describe("Letter status filter (none, new, queued, sent)"),
    limit: z.number().optional().default(50).describe("Max results (default 50)"),
    offset: z.number().optional().default(0).describe("Offset for pagination"),
  }),
}, async (args) => {
  const params = new URLSearchParams();
  if (args.search) params.set("search", args.search);
  if (args.category) params.set("category", args.category);
  if (args.country) params.set("country", args.country);
  if (args.letter_status) params.set("letter_status", args.letter_status);
  if (args.limit) params.set("limit", String(args.limit));
  if (args.offset) params.set("offset", String(args.offset));
  const data = await apiGet(`/api/outreach/profiles?${params}`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_stats", {
  description: "Get outreach pipeline statistics (total profiles, sent, pending, etc.)",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiGet("/api/outreach/stats");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_daily_status", {
  description: "Get today's outreach status (pending letter, queue counts)",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiGet("/api/outreach/daily");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_queue", {
  description: "List outreach queue items with optional status filter",
  inputSchema: z.object({
    status: z.string().optional().describe("Filter by status: pending, sent, failed"),
  }),
}, async (args) => {
  const params = args.status ? `?status=${args.status}` : "";
  const data = await apiGet(`/api/outreach/queue${params}`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_logs", {
  description: "Get recent outreach pipeline audit logs",
  inputSchema: z.object({
    limit: z.number().optional().default(20).describe("Number of log entries (default 20)"),
  }),
}, async (args) => {
  const data = await apiGet(`/api/outreach/logs?limit=${args.limit}`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_health", {
  description: "Check system health (secrets, database, KV, autonomous mode)",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiGet("/api/outreach/health");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_blind_spots", {
  description: "List blind spots — known gaps in Lutterodt family coverage",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiGet("/api/outreach/blind-spots");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("get_autonomous_mode", {
  description: "Check if autonomous mode (auto-send) is enabled",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiGet("/api/settings/autonomous");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Write tools ───────────────────────────────────────

server.registerTool("run_pipeline", {
  description: "Run the daily outreach pipeline (discover, import, enrich, queue, optionally send)",
  inputSchema: z.object({}),
}, async () => {
  const data = await apiPost("/api/outreach/daily");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("run_batch_discovery", {
  description: "Run batch discovery across all search queries and queue new profiles for letters",
  inputSchema: z.object({
    count: z.number().optional().default(25).describe("Number of profiles to queue (default 25, max 100)"),
  }),
}, async (args) => {
  const data = await apiPost(`/api/outreach/daily?batch=true&count=${Math.min(args.count || 25, 100)}`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("generate_letter", {
  description: "Generate a personalized outreach letter HTML for a Lutterodt profile",
  inputSchema: z.object({
    name: z.string().describe("Full name of the person"),
    achievement: z.string().optional().describe("Key achievement or role"),
    category: z.string().optional().describe("Professional category"),
    country: z.string().optional().describe("Country of residence"),
  }),
}, async (args) => {
  const data = await apiPost("/api/outreach/generate", args);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("add_profile", {
  description: "Add a new Lutterodt profile to the directory",
  inputSchema: z.object({
    name: z.string().describe("Full name"),
    category: z.string().optional().describe("Category (e.g. Business, Academia)"),
    country: z.string().optional().describe("Country"),
    achievement: z.string().optional().describe("Key achievement or role description"),
    contact_email: z.string().optional().describe("Email address"),
    contact_linkedin: z.string().optional().describe("LinkedIn URL"),
    dob: z.string().optional().describe("Date of birth"),
  }),
}, async (args) => {
  const data = await apiPost("/api/outreach/profiles", args);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.registerTool("toggle_autonomous", {
  description: "Toggle autonomous mode on/off. When ON, pipeline auto-sends letters via email.",
  inputSchema: z.object({
    enabled: z.boolean().describe("true to enable, false to disable"),
  }),
}, async (args) => {
  const data = await apiPost("/api/settings/autonomous", { enabled: args.enabled });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

// ── Start ─────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Lutterodt server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
