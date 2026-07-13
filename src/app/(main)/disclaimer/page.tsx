import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Legal disclaimer regarding the limits of historical accuracy and liability.",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Disclaimer"
        tag="Disclaimer"
        title="Historical Disclaimer"
        description="Important limitations regarding genealogical accuracy and historical claims on this platform."
      />

      <section className="py-[108px] max-md:py-[72px]">
        <div className="container-main max-w-[700px]">
          <h2 className="text-[clamp(26px,2.8vw,28px)] mb-6">Research Limitations & Disclaimers</h2>
          
          <div className="py-[18px] text-justify">
            <p className="text-charcoal/85 text-[16px]">
              The Lutterodt Renaissance platform does not guarantee the accuracy, completeness, or 
              scientific validation of all genealogical data or historical claims presented. 
              
              <br className="my-4" />
              
              <strong>Important Limitations:</strong>
              <ul className="list-disc list-inside text-charcoal/80 text-[16px] mb-4">
                <li><strong>Acknowledgement of Uncertainty</strong> - Family history involves interpretation where definitive proof may not exist</li>
                <li><strong>No Scientific Validation</strong> - Claims about identity, heritage, or genetic connections are not scientifically validated unless expressly marked</li>
                <li><strong>Evolving Records</strong> - Historical records may be incomplete or contested; we document sources transparently</li>
                <li><strong>No Medical Claims</strong> - This platform makes no medical, genetic, or DNA verification claims</li>
              </ul>
              
              <p className="text-charcoal/85">
                Researchers are encouraged to consult primary sources and independently verify contested information. 
                This platform serves as a collaborative archive rather than an authoritative historical authority.
              </p>
              
              <p className="mt-8 border-t pt-6 text-center">
                <em>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</em>
              </p>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}