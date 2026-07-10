"use client";

import { useState, FormEvent } from "react";
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

const tabSubjects: Record<Tab, string> = {
  general: "General Enquiry",
  join: "Join Interest",
  volunteer: "Volunteer Interest",
  research: "Research Request",
  media: "Media Enquiry",
};

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const body: Record<string, string> = { category: activeTab, subject: tabSubjects[activeTab] };
    if (form["full-name"]) body.name = form["full-name"];
    if (form["email-address"]) body.email = form["email-address"];
    if (form["message"]) body.message = form["message"];
    if (form["anything-youd-like-the-committee-to-know"]) body.message = form["anything-youd-like-the-committee-to-know"];
    if (form["relevant-experience"]) body.message = form["relevant-experience"];
    if (form["nature-of-research-request"]) body.message = form["nature-of-research-request"];
    if (form["enquiry-details--deadline"]) body.message = form["enquiry-details--deadline"];

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setStatus("success");
      setForm({});
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

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

              <p className="text-ivory/55 text-[13px] mb-2">Reunion happening now</p>
              <p className="text-gold-light font-display text-[19px]">Copenhagen — 9–11 Jul 2026</p>
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

              {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-[14px] rounded">
                  Message received. We will be in touch within 5 business days.
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-[14px] rounded">
                  Something went wrong. Please try again or email us directly at hello@lutterodt.org.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* General */}
                <TabPanel show={activeTab === "general"}>
                  <FieldRow>
                    <Field label="Full Name" required value={form["full-name"] || ""} onChange={(v) => set("full-name", v)} />
                    <Field label="Email Address" type="email" required value={form["email-address"] || ""} onChange={(v) => set("email-address", v)} />
                  </FieldRow>
                  <Field label="Message" type="textarea" required className="mb-[22px]" full value={form["message"] || ""} onChange={(v) => set("message", v)} />
                </TabPanel>

                {/* Join Interest */}
                <TabPanel show={activeTab === "join"}>
                  <FieldRow>
                    <Field label="Full Name" value={form["full-name"] || ""} onChange={(v) => set("full-name", v)} />
                    <Field label="Family Branch" placeholder="e.g. Ghana, Germany, USA, UK, Netherlands" value={form["family-branch"] || ""} onChange={(v) => set("family-branch", v)} />
                  </FieldRow>
                  <FieldRow>
                    <Field label="Email Address" type="email" value={form["email-address"] || ""} onChange={(v) => set("email-address", v)} />
                    <Field label="Relationship to Family" type="select" options={["Direct descendant", "Married into family", "Extended relation"]} value={form["relationship-to-family"] || ""} onChange={(v) => set("relationship-to-family", v)} />
                  </FieldRow>
                  <Field label="Anything you'd like the Committee to know" type="textarea" className="mb-[22px]" full value={form["anything-youd-like-the-committee-to-know"] || ""} onChange={(v) => set("anything-youd-like-the-committee-to-know", v)} />
                </TabPanel>

                {/* Volunteer */}
                <TabPanel show={activeTab === "volunteer"}>
                  <FieldRow>
                    <Field label="Full Name" value={form["full-name"] || ""} onChange={(v) => set("full-name", v)} />
                    <Field label="Area of Interest" type="select" options={["Archiving & digitisation", "Oral history interviews", "Event planning", "Web & technology"]} value={form["area-of-interest"] || ""} onChange={(v) => set("area-of-interest", v)} />
                  </FieldRow>
                  <Field label="Relevant experience" type="textarea" className="mb-[22px]" full value={form["relevant-experience"] || ""} onChange={(v) => set("relevant-experience", v)} />
                </TabPanel>

                {/* Research */}
                <TabPanel show={activeTab === "research"}>
                  <FieldRow>
                    <Field label="Institution / Affiliation" value={form["institution--affiliation"] || ""} onChange={(v) => set("institution--affiliation", v)} />
                    <Field label="Email Address" type="email" value={form["email-address"] || ""} onChange={(v) => set("email-address", v)} />
                  </FieldRow>
                  <Field label="Nature of research request" type="textarea" placeholder="What records or periods are you researching?" className="mb-[22px]" full value={form["nature-of-research-request"] || ""} onChange={(v) => set("nature-of-research-request", v)} />
                </TabPanel>

                {/* Media */}
                <TabPanel show={activeTab === "media"}>
                  <FieldRow>
                    <Field label="Outlet" value={form["outlet"] || ""} onChange={(v) => set("outlet", v)} />
                    <Field label="Email Address" type="email" value={form["email-address"] || ""} onChange={(v) => set("email-address", v)} />
                  </FieldRow>
                  <Field label="Enquiry details & deadline" type="textarea" className="mb-[22px]" full value={form["enquiry-details--deadline"] || ""} onChange={(v) => set("enquiry-details--deadline", v)} />
                </TabPanel>

                <button type="submit" disabled={status === "sending"} className="btn-primary">
                  {status === "sending" ? "Sending..." : "Send Message"}
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
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  full?: boolean;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
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
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${inputClass} resize-vertical min-h-[96px] w-full`}
        />
      ) : type === "select" && options ? (
        <select id={id} value={value} onChange={(e) => onChange?.(e.target.value)} className={`${inputClass} w-full`}>
          <option value="">Select...</option>
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
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
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
