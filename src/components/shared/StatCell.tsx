interface StatCellProps {
  number: string;
  label: string;
}

export function StatCell({ number, label }: StatCellProps) {
  return (
    <div className="py-[34px] px-8 border-l border-line-on-dark first:border-l-0 max-md:border-l-0 max-md:[&:nth-child(3)]:border-l-0">
      <div className="font-display text-[34px] text-gold-light">{number}</div>
      <div className="font-mono text-[10.5px] tracking-widest uppercase text-ivory/60 mt-[6px]">{label}</div>
    </div>
  );
}
