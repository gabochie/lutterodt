"use client";

import { useState } from "react";
import { Mail, CheckCircle, Trash2 } from "lucide-react";

const initialContacts = [
  { id: "1", name: "Dr. Kwame Lutterodt", email: "kwame@example.com", subject: "Research Request", message: "I am researching the migration patterns of Gold Coast trading families between 1880 and 1920 and would like access to the family's shipping ledgers.", date: "Today", status: "New" },
  { id: "2", name: "Grace Naa Lutterodt", email: "grace@example.com", subject: "Join Interest", message: "I am a direct descendant of the London branch and would like to register my interest in joining the family portal.", date: "Yesterday", status: "Read" },
  { id: "3", name: "BBC StoryWorks", email: "editorial@bbc.com", subject: "Media Enquiry", message: "We are producing a documentary on diaspora families in West Africa and would like to feature the Lutterodt Renaissance.", date: "2 days ago", status: "New" },
  { id: "4", name: "Prof. Ama Mensah", email: "ama@ug.edu.gh", subject: "Research Request", message: "I am a history professor at the University of Ghana researching 19th century merchant families.", date: "3 days ago", status: "Read" },
  { id: "5", name: "Ekow Lutterodt", email: "ekow@example.com", subject: "Volunteer", message: "I would like to volunteer with the digitisation effort. I have experience in archival scanning.", date: "5 days ago", status: "Read" },
  { id: "6", name: "Reuters News", email: "desk@reuters.com", subject: "Media Enquiry", message: "We would like to do a feature on the family archive project for our African heritage series.", date: "1 week ago", status: "New" },
];

const filters = ["All", "New", "Read"];

export default function AdminContactsPage() {
  const [filter, setFilter] = useState("All");
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = filter === "All" ? contacts : contacts.filter((c) => c.status === filter);

  const markAsRead = (id: string) => {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, status: "Read" as const } : c)));
  };

  const selectedContact = contacts.find((c) => c.id === selected);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Contacts</h1>
        <p className="text-charcoal/50 text-[14px] mt-1">Manage enquiries, join requests, and research access</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-line mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[11px] tracking-widest uppercase py-3 px-6 border-b-2 transition-colors ${
              filter === f
                ? "text-burgundy border-burgundy"
                : "text-charcoal/40 border-transparent hover:text-charcoal/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] max-md:grid-cols-1 gap-0 border border-line bg-ivory">
        {/* List */}
        <div className="divide-y divide-line max-h-[600px] overflow-y-auto border-r border-line">
          {filtered.map((contact) => (
            <button
              key={contact.id}
              onClick={() => { setSelected(contact.id); markAsRead(contact.id); }}
              className={`w-full text-left px-5 py-4 hover:bg-ivory-dim/50 transition-colors ${
                selected === contact.id ? "bg-ivory-dim" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] text-charcoal font-[500]">{contact.name}</span>
                {contact.status === "New" && <span className="w-2 h-2 rounded-full bg-burgundy" />}
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40">{contact.subject}</div>
              <div className="text-[12.5px] text-charcoal/50 mt-1 truncate">{contact.message}</div>
              <div className="font-mono text-[9.5px] text-charcoal/30 mt-1">{contact.date}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="p-6 min-h-[400px]">
          {selectedContact ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-[20px] text-burgundy-ink">{selectedContact.name}</h2>
                <div className="flex gap-2">
                  <button onClick={() => markAsRead(selectedContact.id)} className="p-1.5 text-charcoal/40 hover:text-forest transition-colors"><CheckCircle className="w-4 h-4" /></button>
                  <button className="p-1.5 text-charcoal/40 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-burgundy hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  {selectedContact.email}
                </a>
                <span className="font-mono text-[10px] tracking-wider uppercase text-forest bg-forest/5 px-2.5 py-1">{selectedContact.subject}</span>
              </div>
              <div className="border-t border-line pt-4">
                <p className="text-[14.5px] text-charcoal/70 leading-relaxed">{selectedContact.message}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-line flex gap-3">
                <button className="btn btn-primary text-[11px]">Reply via Email</button>
                <button className="btn btn-outline text-[11px]">Mark as Resolved</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-charcoal/30">
              <div className="text-center">
                <Mail className="w-10 h-10 mx-auto mb-3" />
                <p className="font-mono text-[11px] tracking-widest uppercase">Select a message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
