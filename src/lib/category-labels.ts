/**
 * Canonical category labels (Phase 3.2 — single source of truth).
 *
 * Previously copy-pasted across src/data/*.ts, the directory pages, and two
 * API routes (which had already diverged: one copy lacked `sports`). Import
 * from here; the /api/directory response carries the same map for clients
 * that must render before JS loads.
 */
export const categoryLabels: Record<string, string> = {
  academia: "Academia",
  business: "Business",
  creative: "Creative",
  engineering: "Engineering & Tech",
  healthcare: "Healthcare",
  historical: "Historical",
  law: "Law",
  service: "Service",
  sports: "Sports",
};
