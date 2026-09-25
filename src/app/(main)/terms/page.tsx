import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for The Lutterodt Renaissance - rules and guidelines for using this platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Terms of Service"
        tag="Terms"
        title="Terms of Service"
        description="Rules and guidelines governing the use of the Lutterodt Renaissance platform."
      />

      <section className="py-[108px]">
        <div className="container-main max-w-[720px]">
          <h2 className="text-[clamp(28px,3.2vw,36px)] mb-6">Terms of Use</h2>
          
          <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed">
            <h3>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>

            <h4>1. Acceptance of Terms</h4>
            <p>
              By accessing or using The Lutterodt Renaissance platform, you agree to be bound by these Terms 
              of Service and our Privacy Policy. If you do not agree, do not use this platform.
            </p>

            <h4>2. Eligibility</h4>
            <p>
              This platform is intended for Lutterodt family members and authorized contributors. Access is 
              granted at the discretion of the Renaissance Committee and may be revoked at any time.
            </p>

            <h4>3. Acceptable Use</h4>
            <p>You agree not to:</p>
            <ul>
              <li>Upload false, fraudulent, or misleading content</li>
              <li>Violate others&apos; privacy or share confidential information</li>
              <li>Post defamatory, obscene, or harmful content</li>
              <li>Attempt to compromise platform security or access</li>
              <li>Use the platform for commercial solicitation or spam</li>
            </ul>

            <h4>4. Content Ownership & Licensing</h4>
            <p>
              Family members retain ownership of content they submit. By submitting content, you grant The 
              Lutterodt Renaissance a non-exclusive, perpetual license to display and distribute it within 
              the platform as part of the family archive.
            </p>

            <h4>5. Disclaimer</h4>
            <p>
              The platform and its content are provided &quot;as is&quot; without warranties of any kind. We strive for 
              accuracy in genealogical and historical records, but cannot guarantee completeness or error-free 
              content. Historical interpretations or genealogical connections should be independently verified.
            </p>

            <h4>6. Limitation of Liability</h4>
            <p>
              To the fullest extent permitted by law, The Lutterodt Renaissance Committee shall not be liable 
              for any indirect, incidental, or consequential damages arising from your use of this platform.
            </p>

            <h4>7. Modifications to Terms</h4>
            <p>
              We may update these Terms periodically. Continued use after changes constitutes acceptance of 
              the revised Terms. Material changes will be announced to platform users.
            </p>

            <h4>8. Governing Law</h4>
            <p>
              These Terms shall be governed by the laws of Ghana and England and Wales, recognizing the 
              international nature of the Lutterodt family diaspora.
            </p>

            <h4>9. Contact</h4>
            <p>
              Questions about these Terms? Contact the Renaissance Committee at{' '}
              <Link href="mailto:gabochie@gmail.com" className="text-gold-light hover:underline">
                gabochie@gmail.com
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}