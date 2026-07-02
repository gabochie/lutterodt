"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Tag } from "./Tag";

interface GalleryItemProps {
  src: string;
  alt: string;
  tag: string;
  title: string;
  "data-category"?: string;
}

export function GalleryItem({
  src,
  alt,
  tag,
  title,
  ...props
}: GalleryItemProps) {
  return (
    <ScrollReveal>
      <div
        className="relative aspect-[1/1.1] overflow-hidden bg-charcoal cursor-pointer group"
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] saturate-[0.92] group-hover:saturate-100"
        />
        <div className="absolute left-0 right-0 bottom-0 px-4 pb-[14px] pt-[14px] bg-gradient-to-t from-[rgba(20,6,10,0.85)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <Tag onDark className="!text-[9.5px] before:!w-[14px]">{tag}</Tag>
          <div className="font-display text-[15px] text-ivory mt-1">{title}</div>
        </div>
      </div>
    </ScrollReveal>
  );
}
