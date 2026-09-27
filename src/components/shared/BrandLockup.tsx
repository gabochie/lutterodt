import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

/**
 * Single source of truth for the Lutterodt brand lockup.
 * Used by both the header and the footer so the two never drift apart.
 *
 * The lockup always uses the white-background oval crest, in both themes.
 */
const LOGO_SRC = "/logo/lutterodt-logo-200.webp";
const LOGO_2X = "/logo/lutterodt-logo-400.webp";
const CREST_SIZES = "(min-width: 768px) 63px, 51px";

export function Crest({ className }: { className?: string }) {
  const alt = "Lutterodt — Let Us Have Ideals";
  const box = cn(
    "relative block h-9 w-[51px] shrink-0 md:h-11 md:w-[63px]",
    className
  );

  return (
    <span className={box}>
      <img
        src={LOGO_SRC}
        srcSet={`${LOGO_SRC} 1x, ${LOGO_2X} 2x`}
        sizes={CREST_SIZES}
        width={200}
        height={141}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

export function BrandLockup({
  className,
  nameClassName,
}: {
  className?: string;
  nameClassName?: string;
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
          Lutterodt
        </span>
        <span className="font-mono text-[9.5px] tracking-widest uppercase whitespace-nowrap text-gold-dim">
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
