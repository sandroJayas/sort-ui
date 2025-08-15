import Image from "next/image";
import { HeroAnimations } from "./HeroAnimations";
import { EmailSignupForm } from "./EmailSignupForm";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-[#1724B6] to-[#0F1A7D]">
      {/* Static background */}
      <div className="absolute -right-1/4 top-0 w-[150%] h-full">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[#F8B24E] opacity-10 mix-blend-multiply" />
          <Image
            src="/images/hero-nyc.webp"
            alt="NYC skyline"
            fill
            priority
            quality={60}
            className="object-cover opacity-20 mix-blend-luminosity"
            sizes="(max-width: 768px) 100vw, 150vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1724B6]/80 to-[#1724B6]" />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <div className="px-6 sm:px-8 md:px-12 py-24 sm:py-32">
          <HeroAnimations>
            {/* Badge */}
            <div className="hero-badge inline-block mb-6 sm:mb-8">
              <div className="px-4 sm:px-6 py-1.5 sm:py-2 border-2 border-[#F8B24E] bg-[#F8B24E]/10">
                <span className="text-[10px] sm:text-xs tracking-widest font-black text-[#F8B24E]">
                  NYC ONLY — 2025
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="relative">
              <h1 className="hero-title text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mb-6 sm:mb-8 text-white">
                INFINITE
              </h1>

              <div className="hero-subtitle w-screen ml-[calc(-50vw+50%)]">
                <h2 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter text-[#F8B24E] mb-10 sm:mb-12 text-right pr-6 sm:pr-8 md:pr-12 drop-shadow-[0_10px_20px_rgba(248,178,78,0.3)]">
                  SPACE
                </h2>
              </div>

              <div className="hero-tagline absolute -top-2 sm:-top-4 right-0 sm:right-[10%] md:right-[20%] text-[10px] sm:text-sm font-black">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-8 sm:w-12 h-[2px] bg-[#F8B24E]" />
                  <span className="whitespace-nowrap text-[#FBC774]">
                    FOR YOUR TINY APT
                  </span>
                </div>
              </div>
            </div>

            {/* Subtext */}
            <div className="hero-content grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 max-w-5xl">
              <div className="md:col-span-2">
                <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-white/90">
                  We&apos;re not another storage company. We&apos;re the
                  <span className="font-black text-[#F8B24E]">
                    {" "}
                    spatial revolution{" "}
                  </span>
                  your 400sq ft needs. Manhattan&apos;s answer to the storage
                  crisis.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-3 h-3 bg-[#10B981] animate-pulse" />
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-bold">
                    Live in NYC
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-3 h-3 bg-white/30" />
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-white/50">
                    Other cities Soon
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Form */}
            <div className="hero-cta mt-16 sm:mt-20 md:ml-[15%]">
              <EmailSignupForm />
              <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 sm:mt-6 text-xs sm:text-sm text-[#FBC774] font-bold">
                <span>$55.00/mo</span>
                <span className="text-white/30">•</span>
                <span>5&#39;x 5&#39; storage</span>
                <span className="text-white/30">•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </HeroAnimations>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden
      >
        <div className="w-[2px] h-16 sm:h-20 bg-[#F8B24E]" />
      </div>
    </section>
  );
}
