import { unsubscribe } from "@/lib/newsletter/store";

/**
 * Honours an unsubscribe request.
 *
 * Unsubscribing is always applied immediately and needs no confirmation step:
 * the person has already expressed the intent by clicking the link, and making
 * them confirm again would be hostile. It is safe to call repeatedly.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  if (!token) {
    return Response.json({ error: "Missing unsubscribe token" }, { status: 400 });
  }

  const ok = await unsubscribe(token);
  if (!ok) {
    return Response.json(
      { error: "This unsubscribe link is not valid." },
      { status: 404 }
    );
  }

  return Response.json({ ok: true, status: "unsubscribed" });
}
