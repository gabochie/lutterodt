import type { Metadata } from "next";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architectural design and building in Ghana, websites for diaspora businesses, and real estate advisory — services for the Lutterodt family and its friends.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}