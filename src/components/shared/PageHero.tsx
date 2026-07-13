import Link from "next/link";

interface PageHeroProps {
  breadcrumb: { label: string; href: string };
  current: string;
  tag: string;
  title: string;
  description: string;
}

export function PageHero({ breadcrumb, current, tag, title, description }: PageHeroProps) {
  return (
    <section className="bg-burgundy-ink text-ivory py-[74px] pb-[64px] max-md:py-[48px] max-md:pb-[40px] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(198,161,91,0.16),transparent_45%)] pointer-events-none" />
      <div className="container-main relative z-10">
        <span className="font-mono text-[11.5px] tracking-widest uppercase text-ivory/50">
          <Link href={breadcrumb.href} className="hover:text-gold-light transition-colors">{breadcrumb.label}</Link> / {current}
        </span>
        <span className="tag on-dark block mt-[22px]" data-tag={tag} />
        <h1 className="text-ivory text-[clamp(36px,5vw,58px)] mt-[18px] max-w-[18ch]">{title}</h1>
        <p className="mt-[18px] max-w-[56ch] text-ivory/72 text-[16.5px]">{description}</p>
      </div>
    </section>
  );
}
