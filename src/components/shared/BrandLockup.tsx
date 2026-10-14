import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Single source of truth for the Lutterodt brand lockup.
 * Used by both the header and the footer so the two never drift apart.
 *
 * The lockup uses the heraldic achievement (transparent, square) — it carries
 * its own contrast on light and dark grounds, so no dark-cut variant exists.
 */
const LOGO_SRC = "/logo/lutterodt-crest-200.webp";
const LOGO_2X = "/logo/lutterodt-crest-400.webp";
const CREST_SIZES = "(min-width: 768px) 44px, 36px";

export function Crest({ className }: { className?: string }) {
  const alt = "Lutterodt/h — Let Us Have Ideals";
  const box = cn(
    "relative block h-9 w-9 shrink-0 md:h-11 md:w-11",
    className
  );

  return (
    <span className={box}>
      <img
        src={LOGO_SRC}
        srcSet={`${LOGO_SRC} 1x, ${LOGO_2X} 2x`}
        sizes={CREST_SIZES}
        width={400}
        height={400}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

export function BrandLockup({
  className,
  nameClassName,
  onDark,
}: {
  className?: string;
  nameClassName?: string;
  /** The lockup sits on an always-dark surface (footer, hero overlays). */
  onDark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Crest />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display font-[650] text-[17px] tracking-wide",
            nameClassName ?? "text-heading"
          )}
        >
          Lutterodt<span className={cn("text-gold-ink dark:text-gold-light", onDark && "text-gold-light")}>/h</span>
        </span>
        <span
          className={cn(
            "font-display italic text-[13px] tracking-wide whitespace-nowrap text-fg-muted dark:text-ivory/70",
            onDark && "text-ivory/70"
          )}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
