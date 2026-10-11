/**
 * Structured logging (Phase 2.3).
 *
 * Workers have no APM agent here by design (Sentry on the edge runtime is
 * brittle); instead every log line is single-line JSON so Cloudflare Workers
 * Observability / `wrangler tail --format json` can filter on fields.
 *
 * Usage: log.info("newsletter.send_failed", { email, error });
 */

type Fields = Record<string, string | number | boolean | null | undefined>;

function emit(level: "info" | "warn" | "error", event: string, fields: Fields = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, fields?: Fields) => emit("info", event, fields),
  warn: (event: string, fields?: Fields) => emit("warn", event, fields),
  error: (event: string, fields?: Fields) => emit("error", event, fields),
};
