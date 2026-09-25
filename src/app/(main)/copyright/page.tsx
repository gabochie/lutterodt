import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Copyright & Intellectual Property",
  description: "Copyright notice for The Lutterodt Renaissance platform and content.",
  alternates: { canonical: "/copyright" },
};

export default function CopyrightPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Copyright"
        tag="Legal"
        title="Copyright & IP"
        description="Intellectual property rights and permitted use of content on this platform."
      />

      <section className="py-[108px]">
        <div className="container-main max-w-[720px]">
          <h2 className="text-[clamp(28px,3.2vw,36px)] mb-6">Intellectual Property Rights</h2>
          
          <div className="prose prose-lg max-w-none text-fg/80 leading-relaxed">
            <h3>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>

            <h4>1. Platform Copyright</h4>
            <p>
              © {new Date().getFullYear()} The Lutterodt Renaissance. All rights reserved. The platform design, layout, 
              logos, non-family-submitted graphics, and underlying code (excluding open-source dependencies) are the 
              exclusive intellectual property of the Renaissance Committee and its appointed maintainers.
            </p>

            <h4>2. Family Content Copyright</h4>
            <p>
              All submitted family records, photographs, stories, and contributed data remain the copyright of the 
              individual family member or source who submitted them. By submitting content, users grant the 
              platform a non-exclusive right to host, display, and archive the material for family heritage purposes, 
              as detailed in our Terms of Service.
            </p>

            <h4>3. Restricted Use</h4>
            <p>
              No part of this platform&apos;s copyrighted material may be reproduced, stored in a retrieval system, or 
              transmitted in any form or by any means, electronic, mechanical, photocopying, recording, or otherwise, 
              without the prior written permission of the Renaissance Committee, except for personal viewing 
              within the platform&apos;s authorized environment.
            </p>

            <h4>4. Trademarks</h4>
            <p>
              &quot;The Lutterodt Renaissance,&quot; the associated BrandMark, and other service names used on this platform 
              are trademarks owned by the Lutterodt Renaissance entity.
            </p>

            <h4>5. Contact for Permissions</h4>
            <p>
              To request permission for reuse of official platform assets or content not owned by you, please contact us at{' '}
              <Link href="/contact" className="text-gold-light hover:underline">
                the Contact page
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}