"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, Plus, Check, X } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  access_code: string;
  status: string;
  notes: string;
  latest_interest: string;
  created_at: string;
  updated_at: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"active" | "leads">("active");
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Client>>({});
  const [newClient, setNewClient] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", access_code: generateCode() });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/clients");
      if (r.ok) {
        const all = await r.json();
        setClients(all.filter((c: Client) => c.status === "active"));
        setLeads(all.filter((c: Client) => c.status === "lead" || c.status === "new"));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activate = async (id: number) => {
    await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "active" }),
    });
    fetchData();
  };

  const saveEdit = async () => {
    if (!editId) return;
    await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, ...editData }),
    });
    setEditId(null);
    setEditData({});
    fetchData();
  };

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 0, ...form, status: "active" }),
    });
    setNewClient(false);
    setForm({ name: "", email: "", phone: "", access_code: generateCode() });
    fetchData();
  };

  const filtered = (view === "active" ? clients : leads).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-fg/30 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Clients</h1>
          <p className="text-fg/50 text-[14px] mt-1">
            {clients.length} active clients &middot; {leads.length} leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setNewClient(true); setForm({ name: "", email: "", phone: "", access_code: generateCode() }); }}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase px-4 py-2 bg-burgundy text-ivory hover:bg-burgundy-ink transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Client
          </button>
          <button onClick={fetchData} className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-line text-fg/50 hover:text-fg transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg/30" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("active")} className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${view === "active" ? "bg-burgundy text-ivory border-burgundy" : "bg-surface text-fg/50 border-line"}`}>
            Active ({clients.length})
          </button>
          <button onClick={() => setView("leads")} className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${view === "leads" ? "bg-burgundy text-ivory border-burgundy" : "bg-surface text-fg/50 border-line"}`}>
            Leads ({leads.length})
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Name</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Email</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Phone</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Access Code</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Interest</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Status</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-ivory-dim/50 transition-colors">
                <td className="px-4 py-3 text-[13.5px] text-fg">{c.name}</td>
                <td className="px-4 py-3 text-[12px] text-fg/60">{c.email}</td>
                <td className="px-4 py-3 text-[12px] text-fg/60">{c.phone || "—"}</td>
                <td className="px-4 py-3">
                  <code className="font-mono text-[11px] bg-ivory-dim px-2 py-0.5 rounded-sm text-accent-text">{c.access_code}</code>
                </td>
                <td className="px-4 py-3 text-[12px] text-fg/60">{c.latest_interest || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border ${c.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditId(c.id); setEditData({ name: c.name, email: c.email, phone: c.phone, access_code: c.access_code, status: c.status, notes: c.notes }); }} className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 border border-line text-fg/40 hover:text-fg">
                      Edit
                    </button>
                    {c.status !== "active" && (
                      <button onClick={() => activate(c.id)} className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" title="Activate">
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-fg/40 text-[14px]">
                  No {view === "active" ? "active clients" : "leads"} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-6" onClick={() => { setEditId(null); setEditData({}); }}>
          <div className="bg-surface w-full max-w-lg border border-line" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-[17px] text-heading">Edit Client</h2>
              <button onClick={() => { setEditId(null); setEditData({}); }} className="text-fg/40 hover:text-fg text-[18px]">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Name</label>
                <input value={editData.name || ""} onChange={e => setEditData({ ...editData, name: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Email</label>
                <input value={editData.email || ""} onChange={e => setEditData({ ...editData, email: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Phone</label>
                <input value={editData.phone || ""} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Access Code</label>
                <div className="flex gap-2">
                  <input value={editData.access_code || ""} onChange={e => setEditData({ ...editData, access_code: e.target.value })} className="flex-1 px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim font-mono" />
                  <button onClick={() => setEditData({ ...editData, access_code: generateCode() })} className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border border-line text-fg/50 hover:text-fg">Regen</button>
                </div>
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Status</label>
                <select value={editData.status || "lead"} onChange={e => setEditData({ ...editData, status: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim">
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Notes</label>
                <textarea value={editData.notes || ""} onChange={e => setEditData({ ...editData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-line flex items-center justify-end gap-3">
              <button onClick={() => { setEditId(null); setEditData({}); }} className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 border border-line text-fg/50 hover:text-fg">Cancel</button>
              <button onClick={saveEdit} className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 bg-burgundy text-ivory hover:bg-burgundy-ink">Save</button>
            </div>
          </div>
        </div>
      )}

      {newClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-6" onClick={() => setNewClient(false)}>
          <div className="bg-surface w-full max-w-lg border border-line" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-[17px] text-heading">Add Client</h2>
              <button onClick={() => setNewClient(false)} className="text-fg/40 hover:text-fg text-[18px]">&times;</button>
            </div>
            <form onSubmit={addClient}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim" />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Access Code</label>
                  <div className="flex gap-2">
                    <input value={form.access_code} onChange={e => setForm({ ...form, access_code: e.target.value })} className="flex-1 px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim font-mono" />
                    <button type="button" onClick={() => setForm({ ...form, access_code: generateCode() })} className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border border-line text-fg/50 hover:text-fg">Regen</button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-line flex items-center justify-end gap-3">
                <button type="button" onClick={() => setNewClient(false)} className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 border border-line text-fg/50 hover:text-fg">Cancel</button>
                <button type="submit" className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 bg-burgundy text-ivory hover:bg-burgundy-ink">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
