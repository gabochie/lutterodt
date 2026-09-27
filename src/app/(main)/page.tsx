import type { Metadata } from "next";
import { FullSite } from "@/components/home/FullSite";

export const metadata: Metadata = {
  title: "The Lutterodt Renaissance — A Digital Legacy",
  description:
    "Six generations of the Lutterodt family, preserved for present and future generations — history, timeline, gallery, directory and stories.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Lutterodt Renaissance — A Digital Legacy",
    description:
      "Six generations of the Lutterodt family, preserved for present and future generations.",
    url: "https://lutterodt.org",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Lutterodt Renaissance — A Digital Legacy",
      },
    ],
  },
};

export default function Home() {
  return <FullSite />;
}