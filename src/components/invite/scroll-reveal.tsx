"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    element.classList.add("reveal-hidden");

    const rect = element.getBoundingClientRect();
    const isInInitialViewport = rect.top < window.innerHeight;

    (element as HTMLElement).style.transitionDelay = isInInitialViewport
      ? `${delay}ms`
      : "0ms";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.classList.remove("reveal-hidden");
          element.classList.add("reveal-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
