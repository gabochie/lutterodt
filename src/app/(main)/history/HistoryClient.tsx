"use client";

import { useState } from "react";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { FilterChip } from "@/components/shared/FilterChip";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { timelineData, timelineFilters } from "@/data/timeline";

export function HistoryClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = timelineData.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.filter === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="History"
        tag="Origins → Modern Renaissance"
        title="A history kept in the family's own words and records"
        description="Every entry below is drawn from ledgers, letters, oral history and photographs held by the family. Filter by category, or search the archive directly."
      />

      <section className="py-[72px] pb-0">
        <div className="container-main">
          <div className="max-w-full mb-10">
            <Tag>Origins</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] max-w-[34ch] mt-[18px]">The coast, the crossing, and the house that followed</h2>
            <p className="mt-4 text-[16.5px] text-charcoal/68 max-w-[64ch]">
              The Lutterodt name enters the documented record on the Gold Coast in the mid-19th century. What follows is not a single migration but successive generations of movement, settlement and return — from the coast to the interior, and later, from Accra to the wider world.
            </p>
          </div>
        </div>
      </section>

      <section className="py-[72px] pt-0">
        <div className="container-main">
          <div className="flex items-center justify-between gap-6 flex-wrap mb-[34px]">
            <div className="flex gap-[10px] flex-wrap">
              {timelineFilters.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={activeFilter === f.key}
                  onClick={() => setActiveFilter(f.key)}
                />
              ))}
            </div>
            <div className="flex items-center gap-[10px] border-b border-charcoal py-2 min-w-[220px]">
              <svg viewBox="0 0 20 20" fill="none" className="w-[15px] h-[15px] opacity-50">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search the archive…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent font-body text-[14px] flex-1 focus:outline-0"
              />
            </div>
          </div>

          <div className="relative pl-[36px] border-l border-line">
            {filtered.map((item, i) => (
              <TimelineItem
                key={i}
                year={item.year}
                category={item.category}
                title={item.title}
                description={item.description}
                images={item.images}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-charcoal/50 font-mono text-[12px] tracking-widest uppercase py-8">
                No records match your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}