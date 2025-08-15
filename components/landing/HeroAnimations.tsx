"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface HeroAnimationsProps {
  children: ReactNode;
}

export function HeroAnimations({ children }: HeroAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // Add animation classes
    const elements = {
      badge: container.querySelector(".hero-badge") as HTMLElement,
      title: container.querySelector(".hero-title") as HTMLElement,
      subtitle: container.querySelector(".hero-subtitle") as HTMLElement,
      tagline: container.querySelector(".hero-tagline") as HTMLElement,
      content: container.querySelector(".hero-content") as HTMLElement,
      cta: container.querySelector(".hero-cta") as HTMLElement,
    };

    // Initial animations
    Object.entries(elements).forEach(([key, el], index) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform =
          key === "title"
            ? "translateX(-100px)"
            : key === "subtitle"
              ? "translateX(200px)"
              : "translateY(40px)";

        setTimeout(() => {
          el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
          el.style.opacity = "1";
          el.style.transform = "translate(0, 0)";
        }, index * 100);
      }
    });

    // Scroll indicator animation
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      (scrollIndicator as HTMLElement).style.animation =
        "bounce 2s ease-in-out infinite";
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion]);

  return <div ref={containerRef}>{children}</div>;
}
