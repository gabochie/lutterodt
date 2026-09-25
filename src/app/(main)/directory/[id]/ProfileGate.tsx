"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";

interface Profile {
  id: string; name: string; dob: string | null;
  category: string; country: string; achievement: string;
}

export function ProfileGate({
  profile,
  categoryLabels,
}: {
  profile: Profile;
  categoryLabels: Record<string, string>;
}) {
  const isHistorical = profile.category === "historical";
  const [isVerified, setIsVerified] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("lutterodt_verified="));
    setIsVerified(!!cookie);
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <>
        <section className="bg-burgundy-ink text-ivory py-[74px] pb-[64px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(198,161,91,0.16),transparent_45%)] pointer-events-none" />
          <div className="container-main relative z-10">
            <span className="font-mono text-[11.5px] tracking-widest uppercase text-ivory/50">
              <Link href="/" className="hover:text-gold-light transition-colors">Home</Link> /{" "}
              <Link href="/directory" className="hover:text-gold-light transition-colors">Directory</Link> / Profile
            </span>
            <Tag onDark className="block mt-[22px]">{categoryLabels[profile.category] || profile.category}</Tag>
            <h1 className="text-ivory text-[clamp(36px,5vw,58px)] mt-[18px] max-w-[18ch]">
              {profile.name}
            </h1>
          </div>
        </section>
        <section className="py-[72px]">
          <div className="container-main text-center">
            <p className="text-charcoal/50 font-mono text-[12px] tracking-widest uppercase">Loading...</p>
          </div>
        </section>
      </>
    );
  }

  if (!isHistorical && !isVerified) {
    return (
      <>
        <section className="bg-burgundy-ink text-ivory py-[74px] pb-[64px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(198,161,91,0.16),transparent_45%)] pointer-events-none" />
          <div className="container-main relative z-10">
            <span className="font-mono text-[11.5px] tracking-widest uppercase text-ivory/50">
              <Link href="/" className="hover:text-gold-light transition-colors">Home</Link> /{" "}
              <Link href="/directory" className="hover:text-gold-light transition-colors">Directory</Link> / Profile
            </span>
            <Tag onDark className="block mt-[22px]">{categoryLabels[profile.category] || profile.category}</Tag>
            <h1 className="text-ivory text-[clamp(36px,5vw,58px)] mt-[18px] max-w-[18ch]">
              {profile.name}
            </h1>
          </div>
        </section>

        <section className="py-[72px]">
          <div className="container-main max-w-2xl text-center">
            <div className="p-[40px] bg-ivory-dim border border-line">
              <svg viewBox="0 0 40 40" fill="none" style={{width:40,height:40,display:"block",margin:"0 auto 16px"}}>
                <circle cx="20" cy="20" r="19" stroke="#EEAD16" strokeWidth="1"/>
                <path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#001D95" strokeWidth="1.1"/>
                <circle cx="20" cy="20" r="3" fill="#EEAD16"/>
              </svg>
              <h2 className="text-[22px] font-display font-[550] text-burgundy-ink mb-[10px]">
                Verification Required
              </h2>
              <p className="text-[14.5px] text-charcoal/65 max-w-[44ch] mx-auto mb-[20px] leading-relaxed">
                This profile is part of the modern Lutterodt directory. Verify your identity as a Lutterodt to access the full family archive.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/verify" className="btn-primary">Verify Your Identity</Link>
                <Link href="/directory" className="btn-outline">View Historical Profiles</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-burgundy-ink text-ivory py-[74px] pb-[64px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(198,161,91,0.16),transparent_45%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <span className="font-mono text-[11.5px] tracking-widest uppercase text-ivory/50">
            <Link href="/" className="hover:text-gold-light transition-colors">Home</Link> /{" "}
            <Link href="/directory" className="hover:text-gold-light transition-colors">Directory</Link> / Profile
          </span>
          <Tag onDark className="block mt-[22px]">{categoryLabels[profile.category] || profile.category}</Tag>
          <h1 className="text-ivory text-[clamp(36px,5vw,58px)] mt-[18px] max-w-[18ch]">
            {profile.name}
          </h1>
          {profile.dob && (
            <p className="mt-[10px] font-mono text-[12px] tracking-widest uppercase text-gold-dim">
              {profile.dob}
            </p>
          )}
        </div>
      </section>

      <section className="py-[72px]">
        <div className="container-main max-w-3xl">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-8 mb-10">
            <div>
              <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Category</h3>
              <p className="text-[16px]">{categoryLabels[profile.category] || profile.category}</p>
            </div>
            <div>
              <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Country</h3>
              <p className="text-[16px]">{profile.country}</p>
            </div>
            {profile.dob && (
              <div>
                <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Date of Birth</h3>
                <p className="text-[16px]">{profile.dob}</p>
              </div>
            )}
          </div>

          <div className="border-t border-line pt-8">
            <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-4">Achievement</h3>
            <p className="text-[16.5px] leading-relaxed text-charcoal/82">{profile.achievement}</p>
          </div>

          <div className="mt-12 flex gap-4 flex-wrap">
            <Link href="/directory" className="btn-outline">Back to Directory</Link>
          </div>

          <div className="mt-16 p-[32px] bg-ivory-dim border border-line rounded-sm text-center">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Know a Lutterodt we are missing?</span>
            <p className="text-[15px] text-charcoal/80 mt-[8px] max-w-[44ch] mx-auto">
              This directory is a living record. If you know a Lutterodt who should be here — we would love to hear from you.
            </p>
            <div className="flex items-center justify-center gap-3 mt-[16px]">
              <Link href="/contact" className="btn-outline text-[12px]">Contact Us</Link>
              <Link href="/verify" className="btn-primary text-[12px]">Nominate a Lutterodt</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
