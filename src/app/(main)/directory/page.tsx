import type { Metadata } from "next";
import { DirectoryClient } from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Directory",
  description:
    "The Lutterodt family database — historical and living Lutterodts documented across countries and continents, researched, verified and curated.",
  alternates: { canonical: "/directory" },
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}