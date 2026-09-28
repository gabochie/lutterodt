const FROM_EMAIL = "The Lutterodt Renaissance <hello@lutterodt.org>";

export interface SendResult {
  sent: boolean;
  dryRun: boolean;
  resendId?: string;
  error?: string;
}

/**
 * Transactional mail for the newsletter (confirmation and unsubscribe notices).
 *
 * Separate from the outreach sender on purpose: the outreach path is gated
 * behind autonomous_mode because it writes to third parties, while these
 * messages are transactional and must go out the moment a person asks.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY || "";

  if (!apiKey) {
    // Without a key there is no way to deliver, but the subscription itself is
    // still recorded as pending, so the flow degrades rather than breaks.
    return {
      sent: false,
      dryRun: true,
      error: "RESEND_API_KEY not configured",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        sent: false,
        dryRun: false,
        error: `Resend API ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    const data = (await res.json()) as { id?: string };
    return { sent: true, dryRun: false, resendId: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { sent: false, dryRun: false, error: message };
  }
}
