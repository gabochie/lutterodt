import { cn } from "@/lib/utils";

export function AppMark({
  className,
  plate = false,
}: {
  className?: string;
  plate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block", className)}
    >
      {plate && <rect width="40" height="40" rx="8" fill="#020A3D" />}
      <circle cx="20" cy="20" r="19" stroke="#EEAD16" strokeWidth="1" />
      <path
        d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z"
        stroke="#FBC829"
        strokeWidth="1.1"
      />
      <circle cx="20" cy="20" r="3" fill="#EEAD16" />
    </svg>
  );
}
