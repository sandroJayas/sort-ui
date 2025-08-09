// components/landing/FeaturesSection.tsx
"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const features = [
  {
    number: "001",
    title: "BOXES ARRIVE",
    description:
      "Military-grade storage containers delivered to your door. We navigate your walk-up.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    align: "left",
  },
  {
    number: "002",
    title: "YOU PACK",
    description:
      "That winter coat, old yearbooks, the exercise equipment. Pack it all.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    align: "right",
  },
  {
    number: "003",
    title: "WE COLLECT",
    description:
      "Our crew handles everything. Stairs, doormen, that narrow hallway.",
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop",
    align: "left",
  },
  {
    number: "004",
    title: "INSTANT ACCESS",
    description:
      "Need it back? 2-hour delivery in Manhattan. Because NYC doesn't wait.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    align: "right",
  },
];

export default function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-32 px-8 md:px-12">
      <m.div
        className="mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter mb-4">
          THE PROCESS
        </h2>
        <div className="w-20 h-[2px] bg-white" />
      </m.div>

      <div className="space-y-32">
        {features.map((feature) => (
          <m.div
            key={feature.number}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${
              feature.align === "right" ? "md:ml-[20%]" : "md:mr-[20%]"
            }`}
            initial={{
              opacity: 0,
              x: shouldReduceMotion
                ? 0
                : feature.align === "right"
                  ? 100
                  : -100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div
              className={`space-y-6 ${feature.align === "right" ? "md:order-2" : ""}`}
            >
              <div className="text-gray-600 text-sm tracking-widest">
                {feature.number}
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
                {feature.title}
              </h3>
              <p className="text-lg font-light text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              <m.button
                className="group flex items-center gap-2 text-sm tracking-wider"
                whileHover={shouldReduceMotion ? {} : { x: 10 }}
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </m.button>
            </div>
            <div
              className={`relative h-[400px] ${
                feature.align === "right" ? "md:order-1" : ""
              }`}
            >
              <m.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                loading="lazy"
                quality={75}
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-white/20 z-0" />
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
}
