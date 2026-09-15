import type { Metadata } from "next";
import { HistoryClient } from "./HistoryClient";

export const metadata: Metadata = {
  title: "History",
  description:
    "A history of the Lutterodt family kept in its own words and records — ledgers, letters, oral history and photographs from the Gold Coast to the present.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return <HistoryClient />;
}