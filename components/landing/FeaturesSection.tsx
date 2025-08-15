// Server Component with minimal client interaction
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ScrollAnimator } from "./ScrollAnimator";

const features = [
  {
    number: "001",
    title: "BOXES ARRIVE",
    description:
      "Military-grade storage containers delivered to your door. We navigate your walk-up.",
    image: "/images/boxes-arrive.webp",
    align: "left",
  },
  {
    number: "002",
    title: "YOU PACK",
    description:
      "That winter coat, old yearbooks, the exercise equipment. Pack it all.",
    image: "/images/you-pack.webp",
    align: "right",
  },
  {
    number: "003",
    title: "WE COLLECT",
    description:
      "Our crew handles everything. Stairs, doormen, that narrow hallway.",
    image: "/images/we-collect.webp",
    align: "left",
  },
  {
    number: "004",
    title: "INSTANT ACCESS",
    description:
      "Need it back? 2-hour delivery in Manhattan. Because NYC doesn't wait.",
    image: "/images/instant-access.webp",
    align: "right",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-32 px-8 md:px-12 bg-[#0F1A7D]">
      <ScrollAnimator>
        <div className="mb-20">
          <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter mb-4 text-white">
            THE <span className="text-[#F8B24E]">PROCESS</span>
          </h2>
          <div className="w-20 h-[4px] bg-[#F8B24E]" />
        </div>
      </ScrollAnimator>

      <div className="space-y-32">
        {features.map((feature, index) => (
          <ScrollAnimator key={feature.number}>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${
                feature.align === "right" ? "md:ml-[20%]" : "md:mr-[20%]"
              } animate-slide-${feature.align}`}
            >
              <div
                className={`space-y-6 ${feature.align === "right" ? "md:order-2" : ""}`}
              >
                <div className="text-[#F8B24E] text-sm tracking-widest font-black">
                  {feature.number}
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  {feature.title}
                </h3>
                <p className="text-lg font-light text-white/80 leading-relaxed">
                  {feature.description}
                </p>
                <button className="group flex items-center gap-2 text-sm tracking-wider text-[#F8B24E] font-bold hover:translate-x-2 transition-transform">
                  <span>LEARN MORE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <div
                className={`relative h-[400px] ${feature.align === "right" ? "md:order-1" : ""}`}
              >
                <div
                  className={`absolute inset-0 ${
                    index % 2 === 0
                      ? "bg-gradient-to-br from-[#F8B24E]/40 to-[#F5A02C]/40"
                      : "bg-gradient-to-br from-[#1724B6]/40 to-[#2E3AC8]/40"
                  } z-10 hover:scale-105 transition-transform duration-300`}
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
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#F8B24E] z-0" />
              </div>
            </div>
          </ScrollAnimator>
        ))}
      </div>
    </section>
  );
}
