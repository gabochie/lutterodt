import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "A new chapter of the Lutterodt Renaissance is being prepared — member features, family stories and archive tools.",
  alternates: { canonical: "/coming-soon" },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
