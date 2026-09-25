import type { Metadata } from "next";
import { SponsorClient } from "./SponsorClient";

export const metadata: Metadata = {
  title: "Support & Get Involved",
  description:
    "Support the Lutterodt Institute — contribute materials, stories, and research to the Digital Museum, the Neo-Manor, and the permanent family archive.",
  alternates: { canonical: "/sponsor" },
};

export default function SponsorPage() {
  return <SponsorClient />;
}