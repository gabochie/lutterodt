"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  "data-filter"?: string;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      className={cn(
        "font-mono text-[11px] tracking-widest uppercase px-4 py-[9px] border border-line rounded-full text-fg/60 transition-all duration-200 bg-transparent hover:border-azure hover:text-accent-text",
        active && "bg-azure border-azure text-ivory hover:text-ivory hover:border-azure"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
