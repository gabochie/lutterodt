import { handler as middlewareHandler } from './.open-next/middleware/handler.mjs';
export default {
  async fetch(request, env, ctx) {
    try {
      const resp = await middlewareHandler(request, env, ctx);
      return new Response('middleware loaded, resp=' + (resp instanceof Response ? 'Response' : typeof resp));
    } catch(e) {
      return new Response('Error: ' + (e?.stack || e?.message || JSON.stringify(e)), { status: 500 });
    }
  }
}
