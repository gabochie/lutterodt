const SW_URL = "/sw.js";

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;

  navigator.serviceWorker.register(SW_URL).catch((error: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Service worker registration failed:", error);
    }
  });
}