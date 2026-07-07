import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getSetting(key: string): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return await env.LUTTERODT_KV.get(key);
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { env } = await getCloudflareContext({ async: true });
  await env.LUTTERODT_KV.put(key, value);
}

export async function deleteSetting(key: string): Promise<void> {
  const { env } = await getCloudflareContext({ async: true });
  await env.LUTTERODT_KV.delete(key);
}
