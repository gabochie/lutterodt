"use client";

import { usePathname } from "next/navigation";
import { ComingSoonGate } from "./ComingSoonGate";

export function ContentGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipGate =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login");

  if (skipGate) return <>{children}</>;
  return <ComingSoonGate>{children}</ComingSoonGate>;
}
