import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for The Lutterodt Renaissance - how we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Cookie Policy"
        tag="Cookies"
        title="Cookie Policy"
        description="How we use cookies and similar technologies on the Lutterodt Renaissance platform."
      />

      <section className="py-[108px]">
        <div className="container-main max-w-[720px]">
          <h2 className="text-[clamp(28px,3.2vw,36px)] mb-6">Cookie Usage</h2>
          
          <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed">
            <h3>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>

            <h4>1. What Are Cookies?</h4>
            <p>
              Cookies are small text files stored on your device when you visit websites. They help websites 
              remember information about your visit, like your preferred language and other settings.
            </p>

            <h4>2. How We Use Cookies</h4>
            <p>The Lutterodt Renaissance uses cookies for:</p>
            <ul>
              <li><strong>Essential Cookies</strong> - Required for basic site functionality (session management, authentication)</li>
              <li><strong>Analytics Cookies</strong> - To understand how visitors use our platform (Google Analytics, if enabled)</li>
              <li><strong>Preference Cookies</strong> - To remember your display preferences (language, theme)</li>
            </ul>

            <h4>3. Third-Party Cookies</h4>
            <p>
              We may use third-party services that set their own cookies. This includes:
            </p>
            <ul>
              <li>Google Analytics (if GA is configured)</li>
              <li>Cloudflare for CDN and security features</li>
              <li>Embedded content from external providers (images, videos)</li>
            </ul>

            <h4>4. Your Cookie Choices</h4>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul>
              <li>View and delete cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Receive notifications when cookies are being set</li>
            </ul>

            <h4>5. Do Not Track</h4>
            <p>
              We respect Do Not Track signals where technically feasible. Our analytics cookies are only 
              set after you provide consent, and you may opt out of analytics tracking.
            </p>

            <h4>6. Cookie Retention</h4>
            <p>
              Essential cookies are retained for the duration of your session. Analytics cookies have 
              a maximum retention period of 2 years. You may delete cookies at any time through your 
              browser settings.
            </p>

            <h4>7. Changes to Cookie Policy</h4>
            <p>
              We may update this Cookie Policy. Changes will be posted on this page with an updated 
              &quot;Last Updated&quot; date.
            </p>

            <h4>8. Contact Us</h4>
            <p>
              Questions about our cookie usage? Contact the Renaissance Committee at{' '}
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