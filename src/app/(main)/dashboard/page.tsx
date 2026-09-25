"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/shared/Tag";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  pricing: string;
  deliverables: string;
}

interface Project {
  id: number;
  service_interest: string;
  message: string;
  status: string;
  created_at: string;
}

function parseDeliverables(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    if (typeof parsed === "string") return [parsed.trim()].filter(Boolean);
    return [String(parsed)];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients/services").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/clients/projects").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([servicesData, projectsData]) => {
        setServices(servicesData);
        setProjects(projectsData);
        setName("");
      })
      .catch(() => {
        router.push("/dashboard/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    document.cookie = "client_token=; path=/; max-age=0";
    router.push("/dashboard/login");
  };

  if (loading) {
    return (
      <section className="py-[108px]">
        <div className="container-main text-center text-fg/50">Loading...</div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-burgundy-ink py-[72px]">
        <div className="container-main">
          <div className="flex items-center justify-between">
            <div>
              <Tag onDark>Client Dashboard</Tag>
              <h1 className="text-ivory text-[clamp(28px,3.2vw,38px)] mt-[14px]">Welcome aboard</h1>
            </div>
            <button onClick={handleLogout} className="text-ivory/50 text-[13px] hover:text-ivory transition-colors">Log out</button>
          </div>
        </div>
      </section>

      <section className="py-[72px]">
        <div className="container-main">
          <div className="mb-14">
            <Tag>Service Catalog</Tag>
            <h2 className="text-[clamp(24px,2.8vw,34px)] mt-[14px]">Everything I offer</h2>
            <p className="mt-3 text-[15px] text-fg/68">Full details and pricing for every service. All prices in USD.</p>
          </div>

          {services.length === 0 ? (
            <p className="text-fg/50">No services loaded yet.</p>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {services.map((s) => (
                <div key={s.id} className="bg-ivory-dim rounded-lg p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">{s.category}</div>
                      <h3 className="text-[20px] font-display font-[550] text-heading mt-1">{s.title}</h3>
                    </div>
                    {s.pricing && (
                      <div className="text-[18px] font-display font-[600] text-accent-text whitespace-nowrap ml-4">{s.pricing}</div>
                    )}
                  </div>
                  <p className="text-[14px] text-fg/68 leading-relaxed">{s.description}</p>
                  {s.deliverables && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {parseDeliverables(s.deliverables).map((d) => (
                        <span key={d} className="text-[12px] bg-card px-3 py-1 rounded-sm text-fg/60">{d}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="mb-10">
            <Tag>My Projects</Tag>
            <h2 className="text-[clamp(24px,2.8vw,34px)] mt-[14px]">Active inquiries</h2>
          </div>

          {projects.length === 0 ? (
            <p className="text-fg/50 max-w-3xl">No projects yet. Reach out through the Services page to get started.</p>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {projects.map((p) => (
                <div key={p.id} className="bg-card rounded-lg p-5 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                  <div>
                    <div className="text-[15px] font-medium">{p.service_interest || "General inquiry"}</div>
                    {p.message && <p className="text-[13px] text-fg/60 mt-1">{p.message}</p>}
                    <div className="text-[11px] text-fg/40 font-mono mt-2">{new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm bg-burgundy/8 text-accent-text">{p.status}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 max-w-3xl">
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="text-gold-dim text-[13px] font-mono tracking-wider uppercase hover:underline">
              Need help? Message me on WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
