import type { Metadata } from "next";
import { TakedownClient } from "./TakedownClient";

export const metadata: Metadata = {
  title: "Correction & Removal Requests",
  description:
    "Request a correction or removal of a Lutterodt directory listing. Every request is reviewed by the archive committee within 14 days.",
  alternates: { canonical: "/takedown" },
};

export default function TakedownPage() {
  return <TakedownClient />;
}
