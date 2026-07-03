import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createServerPB() {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(url);

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (authCookie) {
    pb.authStore.loadFromCookie(`${authCookie.name}=${authCookie.value}`);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch {
    pb.authStore.clear();
  }

  return pb;
}

export function getServerPBUrl() {
  return process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
}
