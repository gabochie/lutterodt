import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}

export function Tag({ children, className, onDark }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[10px] font-mono text-[11.5px] tracking-widest uppercase text-gold-dim",
        "before:content-[''] before:w-[22px] before:h-[1px] before:bg-gold-dim",
        onDark && "text-gold-light before:bg-gold-light",
        className
      )}
    >
      {children}
    </span>
  );
}
