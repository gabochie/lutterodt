import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1;
}

export async function createContact(data: {
  email: string;
  name?: string;
  subject?: string;
  message?: string;
  category?: string;
  status?: string;
}): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO contacts (email, name, subject, message, category, status) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      data.email,
      data.name || "",
      data.subject || "",
      data.message || "",
      data.category || "lead",
      data.status || "new"
    )
    .run();
}

export async function getRecordCount(table: string): Promise<number> {
  try {
    const db = await getDB();
    const result = await db
      .prepare(`SELECT COUNT(*) as count FROM ${table}`)
      .first<{ count: number }>();
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}
