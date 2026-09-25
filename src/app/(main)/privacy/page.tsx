import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for The Lutterodt Renaissance - how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Privacy Policy"
        tag="Privacy"
        title="Privacy Policy"
        description="How we collect, use, and protect the information of Lutterodt family members and visitors."
      />

      <section className="py-[108px]">
        <div className="container-main max-w-[720px]">
          <h2 className="text-[clamp(28px,3.2vw,36px)] mb-6">Your Privacy Rights</h2>
          
          <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed">
            <h3>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>

            <h4>1. Information We Collect</h4>
            <p>
              The Lutterodt Renaissance is a family heritage platform. We collect information you directly provide 
              when you create an account, submit content, or contact us. This may include:
            </p>
            <ul>
              <li>Profile information (name, email, family branch, location)</li>
              <li>Content you submit (articles, photos, timeline entries, stories)</li>
              <li>Communication records when you contact us</li>
            </ul>

            <h4>2. How We Use Your Information</h4>
            <p>We use your information to:</p>
            <ul>
              <li>Maintain and secure your family archive</li>
              <li>Facilitate family communication and collaboration</li>
              <li>Improve our platform and services</li>
              <li>Protect against unauthorized access</li>
            </ul>

            <h4>3. Data Sharing & Disclosure</h4>
            <p>
              Information is shared only within the context of the family archive:
            </p>
            <ul>
              <li>With family members who have appropriate access permissions</li>
              <li>To archivists and authorized editors for content management</li>
              <li>When required by law or to protect safety (rare)</li>
            </ul>

            <h4>4. Data Retention & Security</h4>
            <p>
              We retain family data indefinitely as part of the heritage archive. All data is stored securely 
              using industry-standard encryption and access controls. Only authorized family members and 
              designated archivists can access or modify content.
            </p>

            <h4>5. Your Rights</h4>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of content you submitted (subject to archival preservation)</li>
              <li>Control your visibility settings within the family network</li>
            </ul>

            <h4>6. International Transfers</h4>
            <p>
              Family members may be located in different countries. Information may be transferred and stored 
              internationally. By using this platform, you consent to these transfers.
            </p>

            <h4>7. Contact Us</h4>
            <p>
              Questions about privacy? Contact the Renaissance Committee at{' '}
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