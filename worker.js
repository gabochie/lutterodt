// Worker entry wrapper.
//
// opennextjs-cloudflare generates `.open-next/worker.js` with only a `fetch`
// handler, and regenerates it on every build, so the scheduled handler cannot
// live there. This wrapper re-exports the generated worker and adds a
// `scheduled` handler that drives the daily outreach pipeline.
//
// The pipeline is invoked through the WORKER_SELF_REFERENCE service binding
// rather than the public URL. GitHub Actions was calling
// https://lutterodt.org/api/outreach/daily over the edge, where Cloudflare's
// bot challenge intercepted the request and returned an HTML challenge page
// instead of the pipeline result. That made every scheduled run a silent
// no-op. A service binding call stays inside Cloudflare's network and never
// touches the edge rules, so the pipeline actually runs.
//
// The route still requires `Authorization: Bearer <CRON_SECRET>`, so the
// secret is forwarded from the Worker binding.

import openNextWorker from "./.open-next/worker.js";

const PIPELINE_URL = "https://lutterodt.org/api/outreach/daily";

const worker = {
  ...openNextWorker,

  async scheduled(controller, env, ctx) {
    const cronSecret = env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[cron] CRON_SECRET is not set on the Worker; skipping daily pipeline.");
      return;
    }

    const run = async () => {
      try {
        const res = await env.WORKER_SELF_REFERENCE.fetch(PIPELINE_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${cronSecret}` },
        });

        const body = await res.text();

        if (!res.ok) {
          console.error(`[cron] Daily pipeline returned ${res.status}: ${body.slice(0, 500)}`);
          return;
        }

        console.log(`[cron] Daily pipeline ok: ${body.slice(0, 1000)}`);
      } catch (err) {
        console.error(`[cron] Daily pipeline threw: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    // Cron triggers give us a 15 minute window; do not block on the work.
    ctx.waitUntil(run());
  },
};

export default worker;

// The generated worker exports durable object classes that wrangler needs to
// register. Re-export them so they are not dropped from the bundle.
export * from "./.open-next/worker.js";