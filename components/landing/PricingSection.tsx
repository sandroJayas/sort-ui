// components/landing/PricingSection.tsx
"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { signIn } from "next-auth/react";

const pricingFeatures = [
  "Unlimited boxes",
  "Free delivery & pickup",
  "Climate controlled",
  "2hr Manhattan returns",
  "$1 per sq ft",
  "Cancel anytime",
];

export default function PricingSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 bg-white">
      <div className="px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <m.h2
              className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
            >
              <span className="text-[#1724B6]">SIMPLE</span>
              <br />
              <span className="text-[#F8B24E]">PRICING</span>
            </m.h2>

            <div className="space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#0F1A7D]">$55</span>
                <span className="text-2xl text-[#718096]">.00/mo</span>
              </div>

              <div className="space-y-4">
                {pricingFeatures.map((item, i) => (
                  <m.div
                    key={item}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : i * 0.05,
                      duration: shouldReduceMotion ? 0 : 0.3,
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="w-8 h-[3px] bg-[#F8B24E]" />
                    <span className="text-lg font-bold text-[#1A1D23]">
                      {item}
                    </span>
                  </m.div>
                ))}
              </div>

              <m.button
                className="mt-12 px-12 py-4 bg-[#F8B24E] text-[#0F1A7D] font-black text-lg hover:bg-[#F5A02C] transition-all shadow-[6px_6px_0px_#1724B6] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#1724B6]"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
              >
                START NOW
              </m.button>
            </div>
          </div>

          <div className="relative h-[600px] md:h-auto">
            <div className="absolute inset-0 bg-[#1724B6] z-0" />
            <Image
              src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=1000&fit=crop"
              alt="Storage"
              fill
              className="object-cover mix-blend-luminosity opacity-60"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8B24E] via-transparent to-transparent opacity-40" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/95 backdrop-blur p-6 border-4 border-[#F8B24E]">
                <div className="text-[#0F1A7D] font-black text-2xl mb-2">
                  LIMITED TIME
                </div>
                <div className="text-[#1724B6] font-bold">
                  First month free for new NYC residents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
