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

export function ContactClient() {
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

              <div className="h-[1px] bg-line-on-dark my-8" />

              <p className="font-mono text-[10.5px] tracking-widest uppercase text-gold-light mb-4">Follow the Institute</p>
              <div className="space-y-[14px]">
                <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ivory/75 hover:text-gold-light transition-colors text-[14px]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] shrink-0 text-gold-light"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
                  WhatsApp
                </a>
                <a href="https://www.tiktok.com/@lutterodtlnstitute" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ivory/75 hover:text-gold-light transition-colors text-[14px]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] shrink-0 text-gold-light"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  TikTok
                </a>
                <a href="https://www.youtube.com/@LutterodtInstitute" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-ivory/75 hover:text-gold-light transition-colors text-[14px]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px] shrink-0 text-gold-light"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="p-14 max-md:p-8">
              <div className="flex border-b border-line mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`font-mono text-[11.5px] tracking-widest uppercase py-3 mr-8 border-b-2 transition-colors shrink-0 ${
                      activeTab === tab
                        ? "text-accent-text border-burgundy"
                        : "text-fg/45 border-transparent"
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
                <p className="mt-6 text-[12.5px] text-fg/50">
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
    "border-0 border-b border-line bg-transparent py-[10px] px-[2px] font-body text-[15px] text-fg focus:outline-0 focus:border-burgundy";

  return (
    <div className={`field ${full ? "col-span-full" : ""} ${className || ""}`}>
      <label
        htmlFor={id}
        className="font-mono text-[10.5px] tracking-widest uppercase text-fg/55 mb-2 block"
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