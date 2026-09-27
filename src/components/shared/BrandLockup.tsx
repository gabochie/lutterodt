import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Single source of truth for the Lutterodt brand lockup.
 * Used by both the header and the footer so the two never drift apart.
 *
 * variant:
 *  - "auto"  light logo on light backgrounds, dark logo when the `dark` class is set
 *  - "dark"  always the logo cut for a dark background (footer sits on charcoal in both themes)
 */
const LIGHT_SRC = "/logo/lutterodt-logo-200.webp";
const LIGHT_2X = "/logo/lutterodt-logo-400.webp";
const DARK_SRC = "/logo/lutterodt-dark-black-01010A-800.webp";
const DARK_2X = "/logo/lutterodt-dark-black-01010A-1200.webp";
const CREST_SIZES = "(min-width: 768px) 63px, 51px";

export function Crest({ variant = "auto", className }: { variant?: "auto" | "dark"; className?: string }) {
  const alt = "Lutterodt — Let Us Have Ideals";
  const box = cn(
    "relative block h-9 w-[51px] shrink-0 md:h-11 md:w-[63px]",
    className
  );

  const light = (
    <img
      src={LIGHT_SRC}
      srcSet={`${LIGHT_SRC} 1x, ${LIGHT_2X} 2x`}
      sizes={CREST_SIZES}
      width={200}
      height={141}
      alt={alt}
      className="absolute inset-0 h-full w-full object-contain dark:hidden"
    />
  );

  const darkVisibility = variant === "dark" ? "block" : "hidden dark:block";

  const dark = (
    <img
      src={DARK_SRC}
      srcSet={`${DARK_SRC} 1x, ${DARK_2X} 2x`}
      sizes={CREST_SIZES}
      width={800}
      height={533}
      alt={alt}
      className={cn(
        "absolute inset-0 h-full w-full object-contain",
        darkVisibility
      )}
    />
  );

  if (variant === "dark") {
    return <span className={box}>{dark}</span>;
  }

  return (
    <span className={box}>
      {light}
      {dark}
    </span>
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
        <span className="font-mono text-[9.5px] tracking-widest uppercase whitespace-nowrap text-gold-dim">
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
