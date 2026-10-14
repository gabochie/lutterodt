/* The Lutterodt Renaissance — service worker.
 * Cache-first for immutable hashed assets, stale-while-revalidate for images,
 * network-first for the directory API, offline fallback for everything else.
 */
const VERSION = "v1";
const CACHE_SHELL = `lutterodt-shell-${VERSION}`;
const CACHE_TEMP = `lutterodt-temp-${VERSION}`;
const CACHE_IMG = `lutterodt-images-${VERSION}`;

const RUNTIME_ASSETS = ["/sw.js", "/favicon.ico"];

const PRECACHE_PAGES = [
  "/",
  "/directory",
  "/history",
  "/gallery",
  "/about",
  "/projects",
  "/sponsor",
  "/contact",
  "/newsletter/confirm",
  "/newsletter/unsubscribe",
  "/offline",
];

const PRECACHE_ASSETS = [
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/favicon-crest-32.png",
  "/favicon-crest-64.png",
  "/logo/lutterodt-crest-200.webp",
  "/logo/lutterodt-crest-400.webp",
  "/logo/lutterodt-crest-400.png",
];

const OFFLINE_URL = "/offline";

const AUTH_PREFIXES = [
  "/admin",
  "/outreach",
  "/dashboard",
  "/api/auth",
  "/api/login",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_SHELL);
      const urls = [...PRECACHE_PAGES, ...PRECACHE_ASSETS, ...RUNTIME_ASSETS];
      await Promise.all(
        urls
          .map((url) => new Request(url, { cache: "no-store" }))
          .map((req) => cache.add(req).catch(() => undefined))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("lutterodt-") && key !== CACHE_SHELL && key !== CACHE_IMG)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (AUTH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return;
  if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/directory")) return;

  // Immutable hashed Next.js assets: cache-first, never revalidate.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok && (response.type === "basic" || response.type === "cors")) {
            const cache = await caches.open(CACHE_SHELL);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          return cached || new Response("", { status: 404 });
        }
      })()
    );
    return;
  }

  // Gallery/concept images and public media: stale-while-revalidate.
  if (url.pathname.match(/\.(?:png|jpe?g|webp|gif|svg|avif)$/i)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_IMG);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);
        return cached || (await network) || new Response("", { status: 404 });
      })()
    );
    return;
  }

  // Directory JSON: network-first, cache fallback so mobile offline browsing works.
  if (url.pathname.startsWith("/api/directory")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_TEMP);
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ profiles: [], offline: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
    return;
  }

  // Navigations and everything else: network-first, cache fallback, then offline page.
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_TEMP);
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          const cached =
            (await cache.match(request)) ||
            (await caches.match(request)) ||
            (await caches.match(OFFLINE_URL));
          return cached || new Response("", { status: 503 });
        }
      })()
    );
    return;
  }

  // Anything else same-origin: cache-first, then network.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return fetch(request);
    })()
  );
});