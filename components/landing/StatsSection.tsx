// components/landing/StatsSection.tsx
"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function StatsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="relative px-8 md:px-12">
        <m.div
          className="flex flex-col md:flex-row gap-16 md:gap-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { value: "10K", label: "NYC UNITS", suffix: "+" },
            { value: "2", label: "HOUR DELIVERY", suffix: "HR" },
            { value: "99", label: "UPTIME", suffix: "%" },
          ].map((stat, i) => (
            <m.div
              key={stat.label}
              className="relative"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[8vw] md:text-[6vw] font-black tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-2xl md:text-3xl font-light text-gray-500">
                  {stat.suffix}
                </span>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-600 mt-2">
                {stat.label}
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
