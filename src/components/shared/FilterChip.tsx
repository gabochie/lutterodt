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
        "font-mono text-[11px] tracking-widest uppercase px-4 py-[9px] border border-line rounded-full text-charcoal/60 transition-all duration-200 bg-transparent hover:border-burgundy hover:text-burgundy",
        active && "bg-burgundy border-burgundy text-ivory hover:text-ivory hover:border-burgundy"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
