"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, Trash2, Loader2 } from "lucide-react";

interface Contact { id: number; name: string; email: string; subject: string; message: string; status: string; created_at: string; }

const filters = ["All", "new", "read"];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    const res = await fetch("/api/contacts");
    if (res.ok) { const d = await res.json(); setContacts(d.contacts || []); }
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const markAsRead = async (id: number) => {
    await fetch(`/api/contacts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "read" }) });
    setContacts(contacts.map((c) => (c.id === id ? { ...c, status: "read" } : c)));
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (selected === id) setSelected(null);
    fetchContacts();
  };

  const filtered = filter === "All" ? contacts : contacts.filter((c) => c.status === filter);
  const selectedContact = contacts.find((c) => c.id === selected);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Contacts</h1>
        <p className="text-fg/50 text-[14px] mt-1">Manage enquiries, join requests, and research access</p>
      </div>

      <div className="flex gap-0 border-b border-line mb-6">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-[11px] tracking-widest uppercase py-3 px-6 border-b-2 transition-colors ${filter === f ? "text-accent-text border-azure" : "text-fg/40 border-transparent hover:text-fg/60"}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold-dim" /></div>
      ) : (
        <div className="grid grid-cols-[1fr_1.5fr] max-md:grid-cols-1 gap-0 border border-line bg-surface">
          <div className="divide-y divide-line max-h-[600px] overflow-y-auto border-r border-line">
            {filtered.map((contact) => (
              <button key={contact.id} onClick={() => { setSelected(contact.id); if (contact.status === "new") markAsRead(contact.id); }}
                className={`w-full text-left px-5 py-4 hover:bg-ivory-dim/50 transition-colors ${selected === contact.id ? "bg-ivory-dim" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] text-fg font-[500]">{contact.name || "Unknown"}</span>
                  {contact.status === "new" && <span className="w-2 h-2 rounded-full bg-azure" />}
                </div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-fg/40">{contact.subject}</div>
                <div className="text-[12.5px] text-fg/50 mt-1 truncate">{contact.message}</div>
                <div className="font-mono text-[9.5px] text-fg/30 mt-1">{new Date(contact.created_at).toLocaleDateString()}</div>
              </button>
            ))}
          </div>

          <div className="p-6 min-h-[400px]">
            {selectedContact ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-[20px] text-heading">{selectedContact.name || "Unknown"}</h2>
                  <div className="flex gap-2">
                    {selectedContact.status !== "read" && <button onClick={() => markAsRead(selectedContact.id)} className="p-1.5 text-fg/40 hover:text-success-text transition-colors"><CheckCircle className="w-4 h-4" /></button>}
                    <button onClick={() => remove(selectedContact.id)} className="p-1.5 text-fg/40 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-accent-text hover:underline">
                    <Mail className="w-3.5 h-3.5" /> {selectedContact.email}
                  </a>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-success-text bg-forest/5 px-2.5 py-1">{selectedContact.subject}</span>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="text-[14.5px] text-fg/70 leading-relaxed">{selectedContact.message}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-line flex gap-3">
                  <a href={`mailto:${selectedContact.email}`} className="btn btn-primary text-[11px]">Reply via Email</a>
                  <button onClick={() => markAsRead(selectedContact.id)} className="btn btn-outline text-[11px]">Mark as Read</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-fg/30">
                <div className="text-center">
                  <Mail className="w-10 h-10 mx-auto mb-3" />
                  <p className="font-mono text-[11px] tracking-widest uppercase">Select a message</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
