import { confirmSubscription } from "@/lib/newsletter/store";

/**
 * Consumes a confirmation token.
 *
 * Mail scanners and security products pre-fetch links, so a bare GET must not
 * silently opt somebody in. The token is therefore only applied when `apply=1`
 * is present, which is what the "Confirm subscription" button on
 * /newsletter/confirm links to.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const apply = url.searchParams.get("apply") === "1";

  if (!token || token.length > 256) {
    return Response.json({ error: "Missing confirmation token" }, { status: 400 });
  }

  if (!apply) {
    return Response.json(
      {
        ok: true,
        applied: false,
        message:
          "Confirmation link received. Follow the confirm button to finish subscribing.",
      },
      { status: 202 }
    );
  }

  const ok = await confirmSubscription(token);
  if (!ok) {
    return Response.json(
      { error: "This confirmation link is invalid or has expired." },
      { status: 400 }
    );
  }

  return Response.json({ ok: true, applied: true, status: "confirmed" });
}
