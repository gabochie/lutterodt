"use client";

import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";

const tabs = ["general", "join", "volunteer", "research", "media"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  general: "General",
  join: "Join Interest",
  volunteer: "Volunteer",
  research: "Research Request",
  media: "Media",
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Contact"
        tag="We Read Everything"
        title="Get in touch with the Renaissance"
        description="Whether you're family registering interest, a researcher requesting access, or a journalist working on a story — this is the way in."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-[0.9fr_1.1fr] max-md:grid-cols-1 border border-line">
            {/* Sidebar */}
            <div className="bg-burgundy-ink text-ivory p-14 max-md:p-8">
              <h3 className="text-ivory text-[26px] mb-5">Reach the Committee</h3>
              <p className="text-ivory/68 text-[14.5px] mb-8">
                The Renaissance Committee reviews all enquiries weekly. Family and time-sensitive matters are prioritised.
              </p>

              <ContactDetail icon="email" label="Email" value="hello@lutterodt.org" />
              <ContactDetail icon="location" label="Location" value="Harbour Road, Accra, Ghana" />
              <ContactDetail icon="clock" label="Response Time" value="Within 5 business days" />

              <div className="h-[1px] bg-line-on-dark my-8" />

              <p className="text-ivory/55 text-[13px] mb-2">Next family gathering</p>
              <p className="text-gold-light font-display text-[19px]">Renaissance Congress — 14–16 Aug 2026</p>
            </div>

            {/* Form */}
            <div className="p-14 max-md:p-8">
              <div className="flex border-b border-line mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`font-mono text-[11.5px] tracking-widest uppercase py-3 mr-8 border-b-2 transition-colors shrink-0 ${
                      activeTab === tab
                        ? "text-burgundy border-burgundy"
                        : "text-charcoal/45 border-transparent"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                {/* General */}
                <TabPanel show={activeTab === "general"}>
                  <FieldRow>
                    <Field label="Full Name" required />
                    <Field label="Email Address" type="email" required />
                  </FieldRow>
                  <Field label="Message" type="textarea" required className="mb-[22px]" full />
                </TabPanel>

                {/* Join Interest */}
                <TabPanel show={activeTab === "join"}>
                  <FieldRow>
                    <Field label="Full Name" />
                    <Field label="Family Branch" placeholder="e.g. Ghana, Germany, USA, UK, Netherlands" />
                  </FieldRow>
                  <FieldRow>
                    <Field label="Email Address" type="email" />
                    <Field label="Relationship to Family" type="select" options={["Direct descendant", "Married into family", "Extended relation"]} />
                  </FieldRow>
                  <Field label="Anything you'd like the Committee to know" type="textarea" className="mb-[22px]" full />
                </TabPanel>

                {/* Volunteer */}
                <TabPanel show={activeTab === "volunteer"}>
                  <FieldRow>
                    <Field label="Full Name" />
                    <Field label="Area of Interest" type="select" options={["Archiving & digitisation", "Oral history interviews", "Event planning", "Web & technology"]} />
                  </FieldRow>
                  <Field label="Relevant experience" type="textarea" className="mb-[22px]" full />
                </TabPanel>

                {/* Research */}
                <TabPanel show={activeTab === "research"}>
                  <FieldRow>
                    <Field label="Institution / Affiliation" />
                    <Field label="Email Address" type="email" />
                  </FieldRow>
                  <Field label="Nature of research request" type="textarea" placeholder="What records or periods are you researching?" className="mb-[22px]" full />
                </TabPanel>

                {/* Media */}
                <TabPanel show={activeTab === "media"}>
                  <FieldRow>
                    <Field label="Outlet" />
                    <Field label="Email Address" type="email" />
                  </FieldRow>
                  <Field label="Enquiry details & deadline" type="textarea" className="mb-[22px]" full />
                </TabPanel>

                <button type="submit" className="btn-primary">
                  Send Message
                </button>
                <p className="mt-6 text-[12.5px] text-charcoal/50">
                  By submitting, you agree the Committee may contact you regarding this enquiry. We do not share family contact details externally.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function TabPanel({ show, children }: { show: boolean; children: React.ReactNode }) {
  return show ? <>{children}</> : null;
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[1fr_1fr] max-sm:grid-cols-1 gap-[22px] mb-[22px]">{children}</div>;
}

function Field({
  label,
  type = "text",
  required,
  placeholder,
  options,
  full,
  className,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  full?: boolean;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const inputClass =
    "border-0 border-b border-line bg-transparent py-[10px] px-[2px] font-body text-[15px] text-charcoal focus:outline-0 focus:border-burgundy";

  return (
    <div className={`field ${full ? "col-span-full" : ""} ${className || ""}`}>
      <label
        htmlFor={id}
        className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 mb-2 block"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          required={required}
          className={`${inputClass} resize-vertical min-h-[96px] w-full`}
        />
      ) : type === "select" && options ? (
        <select id={id} className={`${inputClass} w-full`}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`${inputClass} w-full`}
        />
      )}
    </div>
  );
}

function ContactDetail({
  icon,
  label,
  value,
}: {
  icon: "email" | "location" | "clock";
  label: string;
  value: string;
}) {
  const icons = {
    email: (
      <path d="M3 6l9 7 9-7M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
    ),
    location: (
      <>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 105 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.4" />
      </>
    ),
    clock: (
      <>
        <path d="M12 8v5l3 2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  };

  return (
    <div className="flex gap-[14px] mb-[22px] items-start">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-[17px] h-[17px] mt-[2px] text-gold-light shrink-0"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        {icons[icon]}
      </svg>
      <div>
        <div className="font-mono text-[10.5px] tracking-widest uppercase text-gold-light mb-[3px]">{label}</div>
        <div className="text-ivory/80 text-[14.5px]">{value}</div>
      </div>
    </div>
  );
}
