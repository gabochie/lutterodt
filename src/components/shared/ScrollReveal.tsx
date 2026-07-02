"use client";

import { useEffect, useRef } from "react";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = "opacity .6s ease, transform .6s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
