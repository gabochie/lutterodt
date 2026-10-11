"use client";

import { useEffect, useState } from "react";
import { StatCell } from "@/components/shared/StatCell";

/**
 * Homepage stat strip (Phase 3.2). Numbers come from /api/directory (D1) so
 * they can never drift from the archive again; static values below are the
 * last confirmed truth, shown while the fetch resolves.
 */
export function HomeStats() {
  const [records, setRecords] = useState("205+");
  const [continents, setContinents] = useState("6");

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        if (typeof d.totalProfiles === "number" && d.totalProfiles > 0) {
          setRecords(`${d.totalProfiles}+`);
        }
        if (Array.isArray(d.continents) && d.continents.length > 0) {
          setContinents(String(d.continents.length));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-4 max-md:grid-cols-2">
      <StatCell number="6" label="Generations Recorded" />
      <StatCell number={records} label="Historical Records" />
      <StatCell number="1847" label="Earliest Entry" />
      <StatCell number={continents} label="Continents Reached" />
    </div>
  );
}
