import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Historical photographs, family events, historic homes and documents — catalogued with year, branch and category in the Lutterodt family archive.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryClient />;
}