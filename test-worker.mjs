export default {
  async fetch(request, env, ctx) {
    return new Response("Hello from Lutterodt Worker!", {
      headers: { "content-type": "text/plain" }
    });
  }
}