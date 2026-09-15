import type { Metadata } from "next";
import { VerifyClient } from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verify Your Identity",
  description:
    "Verify your family connection to unlock the full Lutterodt family directory, including modern profiles across all countries.",
  alternates: { canonical: "/verify" },
  robots: { index: true, follow: false },
};

export default function VerifyPage() {
  return <VerifyClient />;
}