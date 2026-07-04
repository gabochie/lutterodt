import Link from "next/link";
import { notFound } from "next/navigation";
import { profiles, categoryLabels } from "@/data/profiles";
import { Tag } from "@/components/shared/Tag";

export async function generateStaticParams() {
  return profiles
    .filter((p) => p.id)
    .map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = profiles.find((p) => p.id === id);
  if (!profile) return { title: "Profile Not Found" };
  return {
    title: `${profile.name} -- Lutterodt Family Database`,
    description: profile.achievement.slice(0, 160),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = profiles.find((p) => p.id === id);
  if (!profile) notFound();

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
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Know a Lutterodt we're missing?</span>
            <p className="text-[15px] text-charcoal/80 mt-[8px] max-w-[44ch] mx-auto">
              This directory is a living record. If you know a Lutterodt who should be here -- or if
              this is you and you would like to sponsor this project -- we would love to hear from you.
            </p>
            <div className="flex items-center justify-center gap-3 mt-[16px]">
              <Link href="/contact" className="btn-outline text-[12px]">Contact Us</Link>
              <Link href="/sponsor" className="btn-primary text-[12px]">Sponsor the Project</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
