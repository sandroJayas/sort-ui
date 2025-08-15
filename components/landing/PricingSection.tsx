import Image from "next/image";
import { ScrollAnimator } from "./ScrollAnimator";
import { PricingCTA } from "@/components/landing/PricingCTA";

const pricingFeatures = [
  "Unlimited boxes",
  "Free delivery & pickup",
  "Climate controlled",
  "2hr Manhattan returns",
  "$1 per sq ft",
  "Cancel anytime",
];

export function PricingSection() {
  return (
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 bg-white">
      <div className="px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <ScrollAnimator>
              <h2 className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-8 animate-on-scroll">
                <span className="text-[#1724B6]">SIMPLE</span>
                <br />
                <span className="text-[#F8B24E]">PRICING</span>
              </h2>
            </ScrollAnimator>

            <div className="space-y-8">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#0F1A7D]">$55</span>
                <span className="text-2xl text-[#718096]">.00/mo</span>
              </div>

              <ScrollAnimator>
                <div className="space-y-4">
                  {pricingFeatures.map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 animate-on-scroll"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="w-8 h-[3px] bg-[#F8B24E]" />
                      <span className="text-lg font-bold text-[#1A1D23]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollAnimator>

              <PricingCTA />
            </div>
          </div>

          <div className="relative h-[600px] md:h-auto">
            <div className="absolute inset-0 bg-[#1724B6] z-0" />
            <Image
              src="/images/storage-box.webp"
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
