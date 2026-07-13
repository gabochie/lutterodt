import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { StatCell } from "@/components/shared/StatCell";
import { Card } from "@/components/shared/Card";

export function FullSite() {
  return (
    <>
      <section className="relative min-h-[92vh] flex items-end text-ivory bg-cover bg-center" style={{backgroundImage: 'linear-gradient(180deg,rgba(42,11,20,0.35) 0%,rgba(42,11,20,0.55) 55%,rgba(20,6,10,0.92) 100%),url(https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=2000&auto=format&fit=crop)'}}>
        <div className="container-main w-full pb-[88px]">
          <Tag onDark>Est. Archive — Accra, Ghana</Tag>
          <h1 className="text-ivory text-[clamp(42px,6.4vw,84px)] font-display font-[560] mt-[22px] mb-[26px] max-w-[15ch] leading-tight">
            Six generations. <em className="italic font-[440] text-gold-light">One enduring house.</em>
          </h1>
          <p className="text-[18px] max-w-[46ch] text-ivory/82 mb-10">
            The Lutterodt Renaissance is the family&apos;s permanent digital record — a living archive of the people, milestones and homes that carried the name forward, built for those who come next.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/history" className="btn-primary">Explore the History</Link>
            <Link href="/contact" className="btn-ghost">Join the Renaissance</Link>
          </div>
        </div>
        <div className="absolute right-8 bottom-9 hidden md:flex items-center gap-[10px] font-mono text-[10.5px] tracking-widest uppercase text-ivory/55 [writing-mode:vertical-rl] after:content-[''] after:w-[1px] after:h-[46px] after:bg-ivory/40 after:ml-[10px]">
          Scroll to Begin
        </div>
      </section>

      <section className="bg-charcoal text-ivory">
        <div className="container-main">
          <div className="grid grid-cols-4 max-md:grid-cols-2">
            <StatCell number="6" label="Generations Recorded" />
            <StatCell number="140+" label="Historical Records" />
            <StatCell number="1847" label="Earliest Entry" />
            <StatCell number="4" label="Continents Reached" />
          </div>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Featured — Timeline</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">A record built in chronological order, kept in trust</h2>
            <p className="mt-4 text-[16.5px] text-charcoal/68 max-w-[540px]">From the earliest documented arrival to the present Renaissance, each milestone is catalogued with sources, images and context.</p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line">
            <Card
              image="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=900&auto=format&fit=crop"
              alt="Archival portrait, early 20th century"
              tag="Rec. 1847–002 · Origins"
              title="The First Landing"
              description="The earliest documented account of the family's arrival on the coast, drawn from shipping ledgers and parish records."
              href="/history"
              linkLabel="Read the Record"
            />
            <Card
              image="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=900&auto=format&fit=crop"
              alt="Family home archival photo"
              tag="Rec. 1921–014 · Businesses"
              title="The Trading House Opens"
              description="The founding of the family's first commercial venture on the harbour road, and the generation that built it."
              href="/history"
              linkLabel="Read the Record"
            />
            <Card
              image="https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=900&auto=format&fit=crop"
              alt="Graduation ceremony archival photo"
              tag="Rec. 1968–031 · Education"
              title="First of the Family to Read Law"
              description="A milestone that opened three subsequent generations to the professions, told through letters and photographs."
              href="/history"
              linkLabel="Read the Record"
            />
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-ivory relative overflow-hidden py-[108px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Tag onDark>Heritage Highlight</Tag>
            <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] mt-[14px]">The Harbour Road House still stands — and still gathers the family</h2>
            <p className="mt-[18px] text-ivory/68 text-[16px] max-w-[640px]">
              Built in 1923 and restored in 2019, the family home on Harbour Road remains the site of every Renaissance gathering. Its rooms hold three generations of portraits, correspondence and the family&apos;s original ledgers, now being catalogued into this archive.
            </p>
            <Link href="/history" className="btn-gold mt-7 inline-flex">View the Full Timeline</Link>
          </div>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Latest — Stories</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">Oral history, interviews and family news</h2>
            <p className="mt-4 text-[16.5px] text-charcoal/68 max-w-[540px]">New accounts are added as elders share them and as the diaspora sends word home.</p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line">
            <Card
              image="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=900&auto=format&fit=crop"
              alt="Elder being interviewed"
              tag="Oral History"
              title="Auntie Comfort on the War Years"
              description="A recorded conversation on rationing, resilience and keeping the trading house open through 1943."
              href="#"
              linkLabel="Read the Story"
            />
            <Card
              image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop"
              alt="Diaspora family gathering"
              tag="Family News"
              title="London Branch Marks 40 Years"
              description="Four decades since the first Lutterodt household was established abroad — a note from the London cousins."
              href="#"
              linkLabel="Read the Story"
            />
            <Card
              image="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?q=80&w=900&auto=format&fit=crop"
              alt="Archive documents being scanned"
              tag="Heritage"
              title="Digitising the 1950s Ledgers"
              description="Inside the effort to scan, transcribe and cross-reference forty years of handwritten business records."
              href="#"
              linkLabel="Read the Story"
            />
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="max-w-[640px] mb-9">
            <Tag>Preview — Gallery</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">The archive, in pictures</h2>
          </div>
          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[2px] bg-line mb-9">
            <div className="relative aspect-[1/1.1] overflow-hidden bg-charcoal cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=700&auto=format&fit=crop" alt="Family portrait" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] saturate-[0.92] group-hover:saturate-100" />
            </div>
            <div className="relative aspect-[1/1.1] overflow-hidden bg-charcoal cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=700&auto=format&fit=crop" alt="Historic document" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] saturate-[0.92] group-hover:saturate-100" />
            </div>
            <div className="relative aspect-[1/1.1] overflow-hidden bg-charcoal cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1461783436728-0a9217714694?q=80&w=700&auto=format&fit=crop" alt="Coastal town archival photo" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] saturate-[0.92] group-hover:saturate-100" />
            </div>
            <div className="relative aspect-[1/1.1] overflow-hidden bg-charcoal cursor-pointer group">
              <img src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=700&auto=format&fit=crop" alt="Family celebration" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] saturate-[0.92] group-hover:saturate-100" />
            </div>
          </div>
          <Link href="/gallery" className="btn-outline">Browse the Full Gallery</Link>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Upcoming — Events</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">Where the family gathers next</h2>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line">
            <div className="bg-ivory p-[34px] pb-[30px] relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-red-600 text-ivory text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded animate-pulse">Live</div>
              <Tag>9 – 11 July 2026 · Copenhagen</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">Lutterodt/t/h Reunion 2026</h3>
              <p className="text-charcoal/66 text-[14.5px]">A landmark gathering of Lutterodts and Lutteroths — from Ghana, USA, UK, Germany, Estonia, Mexico and beyond — in Copenhagen.</p>
              <Link href="/reunion-2026" className="mt-[18px] font-mono text-[11.5px] tracking-widest uppercase text-burgundy inline-flex items-center gap-2 group">
                View Program
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-[3px]">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
            <div className="bg-ivory p-[34px] pb-[30px]">
              <Tag>14 – 16 August 2026 · Accra</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">The Renaissance Family Congress</h3>
              <p className="text-charcoal/66 text-[14.5px]">The biennial gathering of all branches, held this year at Harbour Road, with a formal unveiling of the digitised archive.</p>
              <Link href="/contact" className="mt-[18px] font-mono text-[11.5px] tracking-widest uppercase text-burgundy inline-flex items-center gap-2 group">
                Register Interest
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-[3px]">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
            <div className="bg-ivory p-[34px] pb-[30px]">
              <Tag>2 October 2026 · London</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">Diaspora Branch Reunion</h3>
              <p className="text-charcoal/66 text-[14.5px]">An afternoon gathering for the UK and European branches, with a screening of newly digitised home videos.</p>
              <Link href="/contact" className="mt-[18px] font-mono text-[11.5px] tracking-widest uppercase text-burgundy inline-flex items-center gap-2 group">
                Register Interest
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-[3px]">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">Join the Renaissance</Tag>
          <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] max-w-[20ch] mx-auto mt-[18px] mb-[22px]">Every family member has a place in this record</h2>
          <p className="text-ivory/70 max-w-[52ch] mx-auto mb-[34px]">Register your interest to receive family news, contribute photographs and stories, and be notified as member features launch in Phase 2.</p>
          <Link href="/contact" className="btn-gold">Register Your Interest</Link>
        </div>
      </section>
    </>
  );
}
