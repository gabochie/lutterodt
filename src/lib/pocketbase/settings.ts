import PocketBase from "pocketbase";

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

let superuserToken: string | null = null;

async function getClient() {
  const pb = new PocketBase(pbUrl);
  pb.autoCancellation(false);
  if (!superuserToken) {
    const auth = await pb.admins.authWithPassword(
      process.env.POCKETBASE_SUPERUSER_EMAIL || "gabochie@gmail.com",
      process.env.POCKETBASE_SUPERUSER_PASSWORD || "AK4QRh369GSYAA"
    );
    superuserToken = auth.token;
  } else {
    pb.authStore.save(superuserToken, null);
  }
  return pb;
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const pb = await getClient();
    const record = await pb.collection("settings").getFirstListItem(`key="${key}"`);
    return record.value || null;
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const pb = await getClient();
  try {
    const record = await pb.collection("settings").getFirstListItem(`key="${key}"`);
    await pb.collection("settings").update(record.id, { value });
  } catch {
    await pb.collection("settings").create({ key, value });
  }
}
