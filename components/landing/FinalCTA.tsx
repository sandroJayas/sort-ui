import Image from "next/image";
import { FinalEmailSignup } from "./FinalEmailSignup";

export function FinalCTA() {
  return (
    <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#F8B24E] to-[#F5A02C]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0F1A7D] opacity-10" />
        <Image
          src="/images/nyc-night.webp"
          alt="NYC Night"
          fill
          quality={50}
          className="object-cover opacity-20 mix-blend-multiply"
          sizes="100vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8B24E] via-[#F8B24E]/80 to-[#F8B24E]/60" />
      </div>

      <div className="relative z-10 text-center px-6 sm:px-8">
        <div className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-6 sm:mb-8 text-[#0F1A7D]">
          YOUR SPACE
          <br />
          <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.5)]">
            AWAITS
          </span>
        </div>

        <div className="animate-fade-up-delay">
          <FinalEmailSignup />
        </div>
      </div>
    </section>
  );
}
