import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Lutterodt Renaissance — family registration, volunteer opportunities, research requests and media enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}