"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollAnimatorProps {
  children: ReactNode;
  threshold?: number;
}

export function ScrollAnimator({
  children,
  threshold = 0.1,
}: ScrollAnimatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements =
              entry.target.querySelectorAll(".animate-on-scroll");
            elements.forEach((el) => {
              el.classList.add("visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return <div ref={ref}>{children}</div>;
}
