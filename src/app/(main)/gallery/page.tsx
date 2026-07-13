"use client";

import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { FilterChip } from "@/components/shared/FilterChip";
import { GalleryItem } from "@/components/shared/GalleryItem";
import { galleryData, galleryFilters } from "@/data/gallery";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = galleryData.filter(
    (item) => activeFilter === "all" || item.filter === activeFilter
  );

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Gallery"
        tag="140+ Catalogued Items"
        title="The legacy gallery"
        description="Historical photographs, family events, historic homes and documents — each catalogued with year, branch and category."
      />

      <section className="py-[72px]">
        <div className="container-main">
          <div className="flex items-center justify-between gap-5 flex-wrap mb-9">
            <div className="flex gap-[10px] flex-wrap">
              {galleryFilters.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={activeFilter === f.key}
                  onClick={() => setActiveFilter(f.key)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[2px] bg-line">
            {filtered.map((item, i) => (
              <GalleryItem
                key={i}
                src={item.src}
                alt={item.alt}
                tag={item.tag}
                title={item.title}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-charcoal/50 font-mono text-[12px] tracking-widest uppercase py-8 text-center">
              No items match this filter.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
