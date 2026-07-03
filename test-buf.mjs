import {Buffer} from 'node:buffer';
export default {
  async fetch(request, env, ctx) {
    return new Response('node:buffer loaded OK');
  }
}
