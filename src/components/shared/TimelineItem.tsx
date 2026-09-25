"use client";

import { ScrollReveal } from "./ScrollReveal";

interface TimelineItemProps {
  year: string;
  category: string;
  title: string;
  description: string;
  images?: { src: string; alt: string }[];
  "data-category"?: string;
}

export function TimelineItem({
  year,
  category,
  title,
  description,
  images,
  ...props
}: TimelineItemProps) {
  return (
    <ScrollReveal>
      <div className="relative pb-14 last:pb-0" {...props}>
        <span className="absolute -left-[41px] top-1 w-[9px] h-[9px] rounded-full bg-surface border-2 border-gold" />
        <div className="tl-year font-mono text-[12px] tracking-widest text-gold-dim mb-2 flex items-center gap-3">
          {year}
          <span className="bg-ivory-dim px-[9px] py-[3px] rounded-full text-[10px] text-success-text">
            {category}
          </span>
        </div>
        <h3 className="text-[24px] mb-[10px]">{title}</h3>
        <p className="text-fg/68 max-w-[58ch] text-[15px]">{description}</p>
        {images && images.length > 0 && (
          <div className="mt-4 flex gap-[10px]">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                width={120}
                height={88}
                loading="lazy"
                className="w-[120px] h-[88px] object-cover rounded-[1px]"
              />
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
