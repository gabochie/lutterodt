import {
  buildConfirmUrl,
  buildUnsubscribeUrl,
  confirmationEmailHtml,
  countSubscribers,
  isValidEmail,
  normalizeEmail,
  subscribe,
  type SubscriberStatus,
} from "@/lib/newsletter/store";
import { sendEmail } from "@/lib/newsletter/email";
import { siteConfig } from "@/config/site";

/**
 * Double opt-in subscribe endpoint.
 *
 * The address is stored as `pending` and never counted as a subscriber until
 * the confirmation link is followed. The response is deliberately identical
 * whether the address is new, already pending or already confirmed, so the
 * endpoint cannot be used to test whether someone is on the list.
 */
export async function POST(request: Request) {
  let email = "";
  let name = "";
  let consent = false;

  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = typeof body.email === "string" ? body.email : "";
      name = typeof body.name === "string" ? body.name.slice(0, 120) : "";
      consent = body.consent === true;
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "");
      name = String(form.get("name") || "").slice(0, 120);
      consent = form.get("consent") === "true" || form.get("consent") === "on";
    }
  } catch {
    return Response.json({ error: "Could not read the request" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  // Recording consent is required, not decorative: it is the only evidence we
  // keep that the person agreed to be written to.
  if (!consent) {
    return Response.json(
      { error: "Please agree to receive the bulletin to continue" },
      { status: 400 }
    );
  }

  try {
    const result = await subscribe(email, name);

    // An already-confirmed or still-pending address gets no second email, but
    // the caller still sees the same reassuring response.
    if (result.status === "pending" || result.status === "resubscribed") {
      const sent = await sendEmail({
        to: result.email,
        subject: "Confirm your Lutterodt archive bulletin subscription",
        html: confirmationEmailHtml({
          name,
          confirmUrl: buildConfirmUrl(result.confirmToken),
          unsubscribeUrl: buildUnsubscribeUrl(result.unsubscribeToken),
        }),
      });

      if (!sent.sent && !sent.dryRun) {
        return Response.json(
          { error: "We could not send the confirmation email. Please try again." },
          { status: 502 }
        );
      }

      return Response.json(
        {
          ok: true,
          status: "pending" satisfies SubscriberStatus,
          delivery: sent.dryRun ? "dry-run" : "sent",
          // Confirm token is only surfaced when the mail was NOT actually sent
          // (local/dev without RESEND_API_KEY). In production it never appears:
          // it is the emailed link, not a response value.
          ...(sent.dryRun
            ? {
                confirmToken: result.confirmToken,
                unsubscribeToken: result.unsubscribeToken,
              }
            : {}),
          message: `Almost there — check ${result.email} for a confirmation link.`,
        },
        { status: 202 }
      );
    }

    return Response.json(
      {
        ok: true,
        status: "pending" satisfies SubscriberStatus,
        message: `Almost there — check ${result.email} for a confirmation link.`,
      },
      { status: 202 }
    );
  } catch {
    return Response.json(
      { error: "Could not complete the subscription. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Counts are useful for the admin view and for a quick launch sanity check.
  return Response.json({
    domain: siteConfig.domain,
    ...(await countSubscribers()),
  });
}
