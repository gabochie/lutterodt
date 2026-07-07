"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FilterChip } from "@/components/shared/FilterChip";
import { profiles, categoryLabels, profileFilters } from "@/data/profiles";
import { directoryStats } from "@/data/stats";

const countries = Array.from(new Set(profiles.map((p) => p.country))).sort();
const historicalProfiles = profiles.filter((p) => p.category === "historical");
const modernProfiles = profiles.filter((p) => p.category !== "historical");

export default function DirectoryPage({ isVerified }: { isVerified: boolean }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const visibleProfiles = isVerified ? profiles : historicalProfiles;

  const filtered = useMemo(() => {
    return visibleProfiles.filter((p) => {
      const matchesFilter = activeFilter === "all" || p.category === activeFilter;
      const matchesCountry = countryFilter === "all" || p.country === countryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.achievement.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesCountry && matchesSearch;
    });
  }, [activeFilter, searchQuery, countryFilter, visibleProfiles]);

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Directory"
        tag={`${isVerified ? directoryStats.totalProfiles : historicalProfiles.length} ${isVerified ? "Documented" : "Historical"} Profiles`}
        title="The Lutterodt family database"
        description={
          isVerified
            ? `${directoryStats.livingProfiles} living notables across ${directoryStats.countries.length} countries, ${directoryStats.continents} continents, and ${directoryStats.categories.length} professional domains -- researched, verified, and curated.`
            : `Showing ${historicalProfiles.length} colonial-era Lutterodts from the Gold Coast (1790--1973). Verify your identity to access all ${directoryStats.totalProfiles} profiles across ${directoryStats.countries.length} countries.`
        }
      />

      {!isVerified && (
        <section className="bg-burgundy-ink text-ivory py-[48px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(198,161,91,0.10),transparent_50%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim mb-3">Family Directory</p>
            <h2 className="text-ivory text-[clamp(26px,3.2vw,38px)] font-display font-[560] max-w-[32ch] mx-auto leading-tight">
              This is a preview of the Lutterodt family archive
            </h2>
            <p className="text-ivory/65 text-[15px] max-w-[56ch] mx-auto mt-[14px] mb-[24px] leading-relaxed">
              You are viewing {modernProfiles.length} historical profiles. There are {directoryStats.totalProfiles - historicalProfiles.length} more Lutterodts documented across {directoryStats.countries.length} countries. Verify your identity to access the full directory.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/verify" className="btn-gold">Verify Your Identity</Link>
              <Link href="/contact" className="btn-ghost">Get in Touch</Link>
            </div>
          </div>
        </section>
      )}

      {isVerified && (
        <section className="bg-burgundy-ink text-ivory py-[48px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(198,161,91,0.10),transparent_50%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim mb-3">Verified Access</p>
            <h2 className="text-ivory text-[clamp(26px,3.2vw,38px)] font-display font-[560] max-w-[28ch] mx-auto leading-tight">
              Every Lutterodt in the world deserves to be in this record
            </h2>
            <p className="text-ivory/65 text-[15px] max-w-[56ch] mx-auto mt-[14px] mb-[24px] leading-relaxed">
              We are actively reaching out to every known Lutterodt across {directoryStats.countries.length} countries and {directoryStats.continents} continents. If you know a Lutterodt we have not yet found, we would like to hear from you.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="btn-gold">Nominate a Lutterodt</Link>
              <Link href="/contact" className="btn-ghost">Get in Touch</Link>
            </div>
          </div>
        </section>
      )}

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

          {!isVerified && (
            <div className="mt-16 p-[40px] bg-ivory-dim border border-line text-center">
              <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Access the full directory</span>
              <h3 className="text-[22px] font-display font-[550] text-burgundy-ink mt-[8px] mb-[12px]">
                {modernProfiles.length} more Lutterodts documented across {directoryStats.countries.length} countries
              </h3>
              <p className="text-[14.5px] text-charcoal/65 max-w-[52ch] mx-auto mb-[20px]">
                Verify your identity as a Lutterodt to access the complete family directory, including modern profiles from Ghana, UK, USA, and beyond.
              </p>
              <Link href="/verify" className="btn-primary">Verify Your Identity</Link>
            </div>
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
