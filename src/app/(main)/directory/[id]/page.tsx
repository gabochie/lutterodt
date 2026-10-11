import { notFound } from "next/navigation";
import { ProfileGate } from "./ProfileGate";

export const dynamic = "force-dynamic";

interface DirProfile {
  id: string; name: string; dob: string | null;
  category: string; country: string; achievement: string;
}

const categoryLabels: Record<string, string> = {
  academia: "Academia", business: "Business", creative: "Creative",
  engineering: "Engineering & Tech", healthcare: "Healthcare",
  historical: "Historical", law: "Law", service: "Service", sports: "Sports",
};

async function fetchProfile(id: string): Promise<DirProfile | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lutterodt.org";
    const r = await fetch(`${base}/api/directory/${id}`, { next: { revalidate: 60 } });
    if (!r.ok) return null;
    const data = await r.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await fetchProfile(id);
  if (!profile) return { title: "Profile Not Found" };
  return {
    title: `${profile.name} — Lutterodt Family Database`,
    description: (profile.achievement || "").slice(0, 160),
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await fetchProfile(id);
  if (!profile) notFound();

  return <ProfileGate profile={profile} categoryLabels={categoryLabels} />;
}
