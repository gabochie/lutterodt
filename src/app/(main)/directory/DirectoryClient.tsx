"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FilterChip } from "@/components/shared/FilterChip";

const profileFilters = [
  { key: "all", label: "All Profiles" },
  { key: "academia", label: "Academia" },
  { key: "business", label: "Business" },
  { key: "creative", label: "Creative" },
  { key: "engineering", label: "Engineering & Tech" },
  { key: "healthcare", label: "Healthcare" },
  { key: "historical", label: "Historical" },
  { key: "law", label: "Law" },
  { key: "service", label: "Service" },
  { key: "sports", label: "Sports" },
];

interface DirProfile {
  id: string; name: string; dob: string | null;
  category: string; country: string; achievement: string;
}

interface DirData {
  profiles: DirProfile[];
  totalProfiles: number;
  livingProfiles: number;
  countries: string[];
  categories: string[];
  continents: number;
  isVerified: boolean;
  categoryLabels: Record<string, string>;
}

export function DirectoryClient() {
  const [data, setData] = useState<DirData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const isVerified = data?.isVerified ?? false;
  const profiles = data?.profiles ?? [];
  const countries = data?.countries ?? [];
  const categoryLabels = data?.categoryLabels ?? {};
  const totalProfiles = data?.totalProfiles ?? 0;
  const livingProfiles = data?.livingProfiles ?? 0;
  const historicalCount = profiles.filter((p) => p.category === "historical").length;
  const modernCount = totalProfiles - historicalCount;

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
  }, [activeFilter, searchQuery, countryFilter, profiles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-charcoal/30 font-mono text-[11px] tracking-widest uppercase">Loading directory...</div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Directory"
        tag={`${isVerified ? totalProfiles : historicalCount} ${isVerified ? "Documented" : "Historical"} Profiles`}
        title="The Lutterodt family database"
        description={
          isVerified
            ? `${livingProfiles} living notables across ${countries.length} countries and ${data?.continents ?? 6} continents, researched, verified, and curated.`
            : `Showing ${historicalCount} colonial-era Lutterodts from the Gold Coast (1790--1973). Verify your identity to access all ${totalProfiles} profiles across ${countries.length} countries.`
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
              You are viewing {historicalCount} historical profiles. There are {modernCount} more Lutterodts documented across {countries.length} countries. Verify your identity to access the full directory.
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
              We are actively reaching out to every known Lutterodt across {countries.length} countries and {data?.continents ?? 6} continents. If you know a Lutterodt we have not yet found, we would like to hear from you.
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
              <ProfileCard key={profile.id} profile={profile} isVerified={isVerified} categoryLabels={categoryLabels} />
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
                {modernCount} more Lutterodts documented across {countries.length} countries
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

function ProfileCard({ profile, isVerified, categoryLabels }: { profile: DirProfile; isVerified: boolean; categoryLabels: Record<string, string> }) {
  const isModern = profile.category !== "historical";
  const locked = isModern && !isVerified;

  return (
    <div className={`bg-ivory p-[26px] pb-[30px] flex flex-col group ${locked ? "relative" : ""}`}>
      {locked && (
        <div className="absolute inset-0 bg-ivory/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="text-center px-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mx-auto mb-2 text-burgundy/60">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <p className="font-mono text-[10px] tracking-widest uppercase text-burgundy/60">Verification required</p>
          </div>
        </div>
      )}
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
        {profile.achievement?.length > 120
          ? profile.achievement.slice(0, 120) + "..."
          : profile.achievement}
      </p>
      {!locked && profile.id && (
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
      {locked && (
        <Link
          href="/verify"
          className="mt-[16px] font-mono text-[11px] tracking-widest uppercase text-burgundy/50 inline-flex items-center gap-2"
        >
          Verify to view
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <rect x="1" y="6" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1"/>
            <path d="M3.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </Link>
      )}
    </div>
  );
}