"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FilterChip } from "@/components/shared/FilterChip";
import { profiles, categoryLabels, profileFilters } from "@/data/profiles";
import { directoryStats } from "@/data/stats";

const countries = Array.from(new Set(profiles.map((p) => p.country))).sort();

export default function DirectoryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchesFilter = activeFilter === "all" || p.category === activeFilter;
      const matchesCountry = countryFilter === "all" || p.country === countryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.achievement.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesCountry && matchesSearch;
    });
  }, [activeFilter, searchQuery, countryFilter]);

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Directory"
        tag={`${directoryStats.totalProfiles} Documented Profiles`}
        title="The Lutterodt family database"
        description={`${directoryStats.livingProfiles} living notables across ${directoryStats.countries.length} countries, ${directoryStats.continents} continents, and ${directoryStats.categories.length} professional domains -- researched, verified, and curated.`}
      />

      <section className="bg-burgundy-ink text-ivory py-[48px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(198,161,91,0.10),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10 text-center">
          <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim mb-3">Sponsor This Project</p>
          <h2 className="text-ivory text-[clamp(26px,3.2vw,38px)] font-display font-[560] max-w-[28ch] mx-auto leading-tight">
            Every Lutterodt in the world deserves to be in this record
          </h2>
          <p className="text-ivory/65 text-[15px] max-w-[56ch] mx-auto mt-[14px] mb-[24px] leading-relaxed">
            We are actively reaching out to every known Lutterodt across 11 countries and 6 continents.
            Your sponsorship keeps this directory free for all family members and funds ongoing research
            to find those we haven't yet reached.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/sponsor" className="btn-gold">Become a Sponsor</Link>
            <Link href="/contact" className="btn-ghost">Nominate a Lutterodt</Link>
          </div>
        </div>
      </section>

      <section className="py-[72px]">
        <div className="container-main">
          <div className="flex items-center justify-between gap-6 flex-wrap mb-[34px]">
            <div className="flex gap-[10px] flex-wrap">
              {profileFilters.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={activeFilter === f.key}
                  onClick={() => setActiveFilter(f.key)}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="font-mono text-[11px] tracking-widest uppercase px-4 py-[9px] border border-line rounded-full text-charcoal/60 bg-transparent focus:outline-0"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-[10px] border-b border-charcoal py-2 min-w-[200px]">
                <svg viewBox="0 0 20 20" fill="none" className="w-[15px] h-[15px] opacity-50">
                  <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent font-body text-[14px] flex-1 focus:outline-0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[2px] bg-line">
            {filtered.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-charcoal/50 font-mono text-[12px] tracking-widest uppercase py-8 text-center">
              No profiles match your search.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function ProfileCard({ profile }: { profile: (typeof profiles)[number] }) {
  return (
    <div className="bg-ivory p-[26px] pb-[30px] flex flex-col group">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">
          {categoryLabels[profile.category] || profile.category}
        </span>
        {profile.dob && (
          <span className="font-mono text-[9px] tracking-widest text-charcoal/40">
            {profile.dob}
          </span>
        )}
      </div>
      <h3 className="text-[18px] mb-[6px] leading-snug">{profile.name}</h3>
      <span className="text-charcoal/50 text-[12px] mb-[10px]">{profile.country}</span>
      <p className="text-charcoal/66 text-[13.5px] flex-1 leading-relaxed">
        {profile.achievement.length > 120
          ? profile.achievement.slice(0, 120) + "..."
          : profile.achievement}
      </p>
      {profile.id && (
        <Link
          href={`/directory/${profile.id}`}
          className="mt-[16px] font-mono text-[11px] tracking-widest uppercase text-burgundy inline-flex items-center gap-2 group"
        >
          View Profile
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-[3px]">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>
      )}
    </div>
  );
}
