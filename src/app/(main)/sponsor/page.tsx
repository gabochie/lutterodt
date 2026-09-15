import type { Metadata } from "next";
import { SponsorClient } from "./SponsorClient";

export const metadata: Metadata = {
  title: "Sponsor & Get Involved",
  description:
    "Sponsor the Lutterodt Institute and help build the Digital Museum, the Neo-Manor, and the permanent family archive. Every contribution counts.",
  alternates: { canonical: "/sponsor" },
};

export default function SponsorPage() {
  return <SponsorClient />;
}