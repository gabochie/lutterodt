import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "How to contact The Lutterodt Renaissance committee.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Contact"
        tag="Contact"
        title="Contact Us"
      />

      <section className="py-[108px]">
        <div className="container-main max-w-[720px]">
          <h2 className="text-[clamp(28px,3.2vw,36px)] mb-6">Contact Information</h2>
          
          <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed">
            <p>
              For official inquiries, questions, or to report concerns, please contact the 
              <strong>Lutterodt Renaissance Committee</strong>.
            </p>
            
            <h3 className="mt-8 mt-2">Official Contact Channels</h3>
            <ul className="list-disc list-inside text-charcoal/75 text-[16px] mb-4">
              <li><strong>Email:</strong> 
                <Link href="mailto:admin@lutterodt.org" className="text-gold-light hover:underline">
                  admin@litterodt.org
                </Link>
              </li>
              <li><strong>Postal Address:</strong> Lutterotd Platform Maintenance, 
                c/o Gideon Obichere, Land Title Office Ghana</li>
            </ul>
            
            <h3 className="mt-6">Contact Form</h3>
            <p className="mt-2">
              For non-urgent administrative matters, use the contact form on our 
              <Link href="/contact" className="text-gold-light hover:underline">Contact</Link> page.
            </p>
            
            <h3 className="mt-2">Emergency/Verification</h3>
            <p className="mt-1">
              For urgent verification concerns, contact a senior committee member through 
              authorized family channels.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}