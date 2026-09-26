import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { ReunionLiveFeed } from "@/components/reunion/ReunionLiveFeed";
import { ReunionLiveStream } from "@/components/reunion/ReunionLiveStream";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "Lutterodt/t/h Reunion 2026",
  description: "The Lutterodt/t/h family reunion in Copenhagen, Denmark — 9–11 July 2026. Program, venue details, and live updates.",
  alternates: { canonical: "/reunion-2026" },
};

const schedule = [
  {
    day: "Thursday 9 July",
    emoji: "🤝",
    title: "Welcome",
    items: [
      { time: "16:30–18:30", label: "Registration / meet-and-greet", location: "El Cava" },
    ],
  },
  {
    day: "Friday 10 July",
    emoji: "🚶",
    title: "Copenhagen & Docken",
    items: [
      { time: "09:00–09:30", label: "Morning registration (late arrivals)" },
      { time: "09:45–11:45", label: "Copenhagen city walk", location: "Start: Marmorkirken (3 km)" },
      { time: "12:15–13:15", label: "Copenhagen Canal Tour", detail: "Sandwich included" },
      { time: "13:30–16:00", label: "Break" },
      { time: "16:00–22:00", label: "Urban Beach Festival", location: "Docken" },
    ],
  },
  {
    day: "Saturday 11 July",
    emoji: "🎉",
    title: "Optional Activities & Family Dinner",
    items: [
      { time: "10:30–13:00", label: "Optional extra activities" },
      { time: "13:00–17:00", label: "Break" },
      { time: "17:00–24:00", label: "Dinner & festive family celebration", location: "Docken" },
    ],
  },
];

const venues = [
  { name: "El Cava", address: "Ved Stranden 16, 1061 Copenhagen K", map: "https://maps.google.com/?q=Ved+Stranden+16+1061+Copenhagen" },
  { name: "Canal Tour", address: "Ved Stranden 26, 1061 Copenhagen K", map: "https://maps.google.com/?q=Ved+Stranden+26+1061+Copenhagen" },
  { name: "Docken", address: "Feergehavnsvej 35, 2150 Nordhavn", map: "https://maps.google.com/?q=Feergehavnsvej+35+2150+Nordhavn" },
];

export default function Reunion2026Page() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Reunion 2026"
        tag="Copenhagen, Denmark"
        title="Lutterodt/t/h Reunion 2026"
        description="Three days of connection, culture and celebration — a landmark gathering of Lutterodts and Lutteroths from across the diaspora, hosted in Copenhagen from 9–11 July 2026."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Recap</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">What happened in Copenhagen</h2>
            <p className="mt-4 text-[16.5px] text-fg/68">
              The Lutterodt/t/h family gathered from across the globe — Ghana, USA, UK, Germany, Estonia, Mexico and beyond — for the Copenhagen reunion. The gathering took place 9–11 July 2026; the programme below is preserved as a permanent record. All times are local (CEST, UTC+2).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schedule.map((day) => (
              <ScrollReveal key={day.day}>
                <div className="bg-ivory-dim rounded-lg p-8 h-full flex flex-col">
                  <div className="text-[32px] mb-3">{day.emoji}</div>
                  <Tag>{day.day}</Tag>
                  <h3 className="text-[22px] mt-2 mb-5">{day.title}</h3>
                  <div className="flex-1 space-y-4">
                    {day.items.map((item) => (
                      <div key={item.time} className="border-l-2 border-gold-dim/30 pl-4">
                        <div className="font-mono text-[12px] text-gold-dim tracking-wider">{item.time}</div>
                        <div className="text-[15px] font-medium mt-1">{item.label}</div>
                        {item.location && <div className="text-[13px] text-fg/60 mt-0.5">{item.location}</div>}
                        {item.detail && <div className="text-[13px] text-fg/60 mt-0.5 italic">{item.detail}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ReunionLiveStream />
      <ReunionLiveFeed />

      <section className="py-[108px] bg-[#faf8f5]">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>For Attendees</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[18px]">Keep adding to the record</h2>
            <p className="mt-3 text-[15px] text-fg/68">
              The reunion has ended, but the check-in feed and photo record stay open. If you were there, here are three ways to add what only you hold.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-7">
              <div className="text-[28px] mb-4">✍️</div>
              <h3 className="text-[18px] mb-2">Add your check-in</h3>
              <p className="text-[14px] text-fg/60 mb-4">
                The &ldquo;Who&rsquo;s here&rdquo; feed above remains the roll of attendees. Ask the admin to add your name and a message, or log in to post directly. Entries appear on the page for everyone.
              </p>
              <span className="text-gold-dim text-[12px] font-mono tracking-wider">30-second setup</span>
            </div>
            <div className="bg-card rounded-lg p-7">
              <div className="text-[28px] mb-4">📱</div>
              <h3 className="text-[18px] mb-2">Share a video</h3>
              <p className="text-[14px] text-fg/60 mb-4">
                Recordings and clips from the three days are welcome. Send the link to the site admin and it will be added to the reunion record alongside the programme.
              </p>
              <span className="text-gold-dim text-[12px] font-mono tracking-wider">YouTube, Vimeo, or direct file</span>
            </div>
            <div className="bg-card rounded-lg p-7">
              <div className="text-[28px] mb-4">📸</div>
              <h3 className="text-[18px] mb-2">Share photos</h3>
              <p className="text-[14px] text-fg/60 mb-4">
                Tag photos with <strong className="text-fg">#LutterodtReunion2026</strong> on social media, or send them to the admin to include in the check-in feed with a photo attachment.
              </p>
              <span className="text-gold-dim text-[12px] font-mono tracking-wider">Facebook &bull; Instagram &bull; WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[108px] bg-ivory-dim">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Venues</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">Key locations</h2>
            <p className="mt-4 text-[16.5px] text-fg/68">All within Copenhagen, connected by metro and walking distance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((v) => (
              <div key={v.name} className="bg-card rounded-lg p-6">
                <h3 className="text-[18px] mb-2">{v.name}</h3>
                <p className="text-[14px] text-fg/60 mb-4">{v.address}</p>
                <a href={v.map} target="_blank" rel="noopener noreferrer" className="text-gold-dim text-[13px] font-mono tracking-wider uppercase hover:underline">
                  Open in Maps →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-card rounded-lg p-6">
            <h3 className="text-[18px] mb-3">Program flyer</h3>
            <img
              src="/images/reunion-2026-program.jpg"
              alt="Lutterodt/t/h Reunion 2026 program flyer"
              width={1220}
              height={1563}
              loading="lazy"
              className="w-full max-w-[600px] rounded border border-line"
            />
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">A historic gathering</Tag>
          <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] max-w-[26ch] mx-auto mt-[18px] mb-[20px]">One family, many branches</h2>
          <p className="text-ivory/70 max-w-[56ch] mx-auto mb-[34px]">
            Lutterodts and Lutteroths from six continents — gathered in Copenhagen in July 2026, building connections that will last for generations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/directory" className="btn-gold">Browse the Directory</Link>
            <Link href="/history" className="btn-outline-ivory">Explore Family History</Link>
            <Link href="/contact?intent=testimony" className="btn-outline-ivory">Share Your Memories</Link>
          </div>
        </div>
      </section>
    </>
  );
}
