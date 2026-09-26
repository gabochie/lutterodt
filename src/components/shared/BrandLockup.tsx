import { cn } from "@/lib/utils";

/**
 * Single source of truth for the Lutterodt brand lockup.
 * Used by both the header and the footer so the two never drift apart.
 *
 * variant:
 *  - "auto"  light logo on light backgrounds, dark logo when the `dark` class is set
 *  - "dark"  always the logo cut for a dark background (footer sits on charcoal in both themes)
 */
export function Crest({ variant = "auto", className }: { variant?: "auto" | "dark"; className?: string }) {
  const size = cn("h-9 w-auto shrink-0 md:h-11", className);
  const alt = "Lutterodt — Lasz Uns Ideale Haben";

  if (variant === "dark") {
    return (
      <img
        src="/logo/lutterodt-dark-black-01010A-800.webp"
        srcSet="/logo/lutterodt-dark-black-01010A-800.webp 1x, /logo/lutterodt-dark-black-01010A-1200.webp 2x"
        width={800}
        height={564}
        alt={alt}
        className={size}
      />
    );
  }

  return (
    <>
      <img
        src="/logo/lutterodt-logo-200.webp"
        srcSet="/logo/lutterodt-logo-200.webp 1x, /logo/lutterodt-logo-400.webp 2x"
        width={200}
        height={141}
        alt={alt}
        className={cn(size, "dark:hidden")}
      />
      <img
        src="/logo/lutterodt-dark-black-01010A-800.webp"
        srcSet="/logo/lutterodt-dark-black-01010A-800.webp 1x, /logo/lutterodt-dark-black-01010A-1200.webp 2x"
        width={800}
        height={564}
        alt={alt}
        className={cn(size, "hidden dark:block")}
      />
    </>
  );
}

export function BrandLockup({
  variant = "auto",
  className,
  nameClassName,
}: {
  variant?: "auto" | "dark";
  className?: string;
  nameClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Crest variant={variant} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display font-[650] text-[17px] tracking-wide",
            nameClassName ?? "text-heading"
          )}
        >
          Lutterodt
        </span>
        <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold-dim">
          Renaissance
        </span>
      </span>
    </span>
  );
}
