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
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 bg-white text-black">
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
              SIMPLE
              <br />
              <span className="text-gray-300">PRICING</span>
            </m.h2>

            <div className="space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black">$55</span>
                <span className="text-2xl text-gray-500">.00/mo</span>
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
                    <div className="w-8 h-[1px] bg-black" />
                    <span className="text-lg font-light">{item}</span>
                  </m.div>
                ))}
              </div>

              <m.button
                className="mt-12 px-12 py-4 bg-black text-white font-bold text-lg hover:bg-gray-900 transition-colors"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
              >
                START NOW
              </m.button>
            </div>
          </div>

          <div className="relative h-[600px] md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=1000&fit=crop"
              alt="Storage"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
