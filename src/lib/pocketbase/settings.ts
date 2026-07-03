import PocketBase from "pocketbase";

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

export async function getSetting(key: string): Promise<string | null> {
  try {
    const pb = new PocketBase(pbUrl);
    const record = await pb.collection("settings").getFirstListItem(`key="${key}"`);
    return record.value || null;
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const pb = new PocketBase(pbUrl);
  try {
    const record = await pb.collection("settings").getFirstListItem(`key="${key}"`);
    await pb.collection("settings").update(record.id, { value });
  } catch {
    await pb.collection("settings").create({ key, value });
  }
}
