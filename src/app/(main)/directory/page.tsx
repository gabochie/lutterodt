import { cookies } from "next/headers";
import DirectoryClient from "./DirectoryClient";

export const dynamic = "force-dynamic";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, sigB64] = parts;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret + "_vrfy"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(sigB64.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0)
    );
    return await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(payloadB64));
  } catch {
    return false;
  }
}

export default async function DirectoryPage() {
  const cookieStore = await cookies();
  const vToken = cookieStore.get("lutterodt_verified")?.value || "";
  const secret = process.env.ADMIN_PASSWORD || "";
  const isVerified = vToken ? await verifyToken(vToken, secret) : false;

  return <DirectoryClient isVerified={isVerified} />;
}
