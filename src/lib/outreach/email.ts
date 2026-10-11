import { getSetting } from "@/lib/cf/kv";
import { errMessage } from "@/lib/utils";

const FROM_EMAIL = "The Lutterodt Renaissance <hello@lutterodt.org>";

export interface SendResult {
  sent: boolean;
  dryRun: boolean;
  resendId?: string;
  error?: string;
}

export async function isAutonomousMode(): Promise<boolean> {
  try { return (await getSetting("autonomous_mode")) === "true"; } catch { return false; }
}

export async function sendLetter(params: {
  to: string;
  subject: string;
  html: string;
  profileName: string;
}): Promise<SendResult> {
  const autonomous = await isAutonomousMode();

  if (!autonomous) {
    return { sent: false, dryRun: true };
  }

  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) {
    return { sent: false, dryRun: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
      const errBody = await res.text().catch(() => "");
      return { sent: false, dryRun: false, error: `Resend API ${res.status}: ${errBody.slice(0, 200)}` };
    }

    const data = await res.json() as { id?: string };
    return { sent: true, dryRun: false, resendId: data.id };
  } catch (err) {
    return { sent: false, dryRun: false, error: errMessage(err) || "Unknown error" };
  }
}
