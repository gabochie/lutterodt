import type { Metadata } from "next";
import { ReunionLiveStream } from "@/components/reunion/ReunionLiveStream";
import { ReunionLiveFeed } from "@/components/reunion/ReunionLiveFeed";

export const metadata: Metadata = {
  title: "Reunion Record — Lutterodt Reunion 2026",
  description:
    "Recordings and the attendee check-in feed from the Lutterodt/t/h family reunion in Copenhagen, 9–11 July 2026.",
};

export default function LivePage() {
  return (
    <>
      <ReunionLiveStream />
      <ReunionLiveFeed />
    </>
  );
}
