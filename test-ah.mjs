import {AsyncLocalStorage} from 'node:async_hooks';
export default {
  async fetch() { return new Response('async_hooks OK'); }
}
