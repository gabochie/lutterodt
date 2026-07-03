import { runWithCloudflareRequestContext } from './.open-next/cloudflare/init.js';
export default {
  async fetch(request, env, ctx) {
    return new Response('init.js loaded OK');
  }
}
