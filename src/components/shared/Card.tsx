import Link from "next/link";
import { Tag } from "./Tag";

interface CardProps {
  image: string;
  alt: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export function Card({ image, alt, tag, title, description, href, linkLabel }: CardProps) {
  return (
    <div className="bg-ivory flex flex-col group">
      <div className="aspect-[4/3] overflow-hidden bg-ivory-dim">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.045]"
        />
      </div>
      <div className="p-[26px] pb-[30px] flex-1 flex flex-col">
        <Tag className="!mb-[14px]">{tag}</Tag>
        <h3 className="text-[21px] mb-[10px]">{title}</h3>
        <p className="text-charcoal/66 text-[14.5px] flex-1">{description}</p>
        <Link
          href={href}
          className="mt-[18px] font-mono text-[11.5px] tracking-widest uppercase text-burgundy inline-flex items-center gap-2"
        >
          {linkLabel}
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-[3px]">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
