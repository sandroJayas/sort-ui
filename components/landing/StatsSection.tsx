// components/landing/StatsSection.tsx
"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function StatsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1724B6]/5 via-[#F8B24E]/5 to-[#1724B6]/5" />
      <div className="relative px-8 md:px-12">
        <m.div
          className="flex flex-col md:flex-row gap-16 md:gap-32 justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { value: "10K", label: "NYC UNITS", suffix: "+", color: "#1724B6" },
            {
              value: "2",
              label: "HOUR DELIVERY",
              suffix: "HR",
              color: "#F8B24E",
            },
            { value: "99", label: "UPTIME", suffix: "%", color: "#1724B6" },
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
                <span
                  className="text-[8vw] md:text-[6vw] font-black tracking-tighter"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: stat.color, opacity: 0.6 }}
                >
                  {stat.suffix}
                </span>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#0F1A7D] font-black mt-2">
                {stat.label}
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
