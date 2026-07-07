import Link from "next/link";
import { notFound } from "next/navigation";
import { profiles, categoryLabels } from "@/data/profiles";
import { Tag } from "@/components/shared/Tag";
import { ProfileGate } from "./ProfileGate";

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
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
    title: `${profile.name} — Lutterodt Family Database`,
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

  return <ProfileGate profile={profile} categoryLabels={categoryLabels} />;
}
