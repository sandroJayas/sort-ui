// page.tsx - Optimized Landing Page with Performance Fixes
"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
  memo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

// Lazy load heavy sections with better error boundaries
const StatsSection = lazy(() =>
  import("@/components/landing/StatsSection").catch(() => ({
    default: () => <div className="h-96 bg-[#1724B6]" />,
  })),
);
const FeaturesSection = lazy(() =>
  import("@/components/landing/FeaturesSection").catch(() => ({
    default: () => <div className="h-96 bg-[#0F1A7D]" />,
  })),
);
const PricingSection = lazy(() =>
  import("@/components/landing/PricingSection").catch(() => ({
    default: () => <div className="h-96 bg-white" />,
  })),
);

// Memoized components to prevent re-renders
const Navigation = memo(function Navigation() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <div className="flex justify-between items-center p-6 sm:p-8 md:p-12">
        <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
          SORT
        </div>
        <button
          className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-[#F8B24E] bg-[#F8B24E] text-[#0F1A7D] font-black hover:bg-transparent hover:text-[#F8B24E] transition-all duration-300 text-sm sm:text-base uppercase tracking-wider transform-gpu"
          onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
        >
          Enter
        </button>
      </div>
    </nav>
  );
});

const ScrollIndicator = memo(function ScrollIndicator({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean;
}) {
  return (
    <m.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
      animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <div className="w-[2px] h-16 sm:h-20 bg-[#F8B24E]" />
    </m.div>
  );
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollY } = useScroll();

  // Detect mobile and client-side rendering
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Use passive listener for better scroll performance
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimized scroll transforms with will-change
  const heroY = useTransform(
    scrollY,
    [0, 1000],
    shouldReduceMotion || isMobile ? [0, 0] : [0, -150],
    { clamp: true },
  );

  const heroScale = useTransform(
    scrollY,
    [0, 500],
    shouldReduceMotion || isMobile ? [1, 1] : [1, 0.95],
    { clamp: true },
  );

  // Mouse tracking with performance optimizations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 25, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 25, damping: 30 });

  // Optimized mouse handler with RAF
  const rafRef = useRef<number>(0);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (shouldReduceMotion || isMobile) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX / innerWidth - 0.5) * 15); // Reduced range for subtlety
        mouseY.set((clientY / innerHeight - 0.5) * 15);
      });
    },
    [mouseX, mouseY, shouldReduceMotion, isMobile],
  );

  useEffect(() => {
    if (!shouldReduceMotion && !isMobile && isClient) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [handleMouseMove, shouldReduceMotion, isMobile, isClient]);

  // Enhanced form submission with proper error handling
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setEmailError(null);
      setIsSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      if (!email || !email.includes("@")) {
        setEmailError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to initiate signup");
        }

        const { authUrl } = await response.json();
        window.location.href = authUrl;
      } catch (error) {
        console.error("Signup error:", error);
        setEmailError("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        ref={containerRef}
        className="bg-[#0F1A7D] text-white overflow-x-hidden"
      >
        <Navigation />

        {/* Hero Section - Optimized animations */}
        <section
          ref={heroRef}
          className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-[#1724B6] to-[#0F1A7D]"
        >
          {/* Optimized background with lazy loading */}
          {isClient && (
            <m.div
              className="absolute -right-1/4 top-0 w-[150%] h-full will-change-transform"
              style={{
                y: heroY,
                scale: heroScale,
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-[#F8B24E] opacity-10 mix-blend-multiply" />
                <Image
                  src="https://images.unsplash.com/photo-1514565131-fce0801e3485?w=1200&h=800&fit=crop&q=60"
                  alt="NYC"
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
            </m.div>
          )}

          <div className="relative z-10 w-full">
            <div className="px-6 sm:px-8 md:px-12 py-24 sm:py-32">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
              >
                {/* Floating Badge */}
                <m.div
                  className="inline-block mb-6 sm:mb-8"
                  style={
                    shouldReduceMotion || isMobile
                      ? {}
                      : { x: smoothMouseX, y: smoothMouseY }
                  }
                >
                  <div className="px-4 sm:px-6 py-1.5 sm:py-2 border-2 border-[#F8B24E] bg-[#F8B24E]/10">
                    <span className="text-[10px] sm:text-xs tracking-widest font-black text-[#F8B24E]">
                      NYC ONLY — 2025
                    </span>
                  </div>
                </m.div>

                {/* Typography with staggered animation */}
                <div className="relative">
                  <m.h1
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mb-6 sm:mb-8 text-white transform-gpu"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.6,
                      ease: "easeOut",
                    }}
                  >
                    INFINITE
                  </m.h1>

                  <m.div
                    className="w-screen ml-[calc(-50vw+50%)]"
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.6,
                      delay: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter text-[#F8B24E] mb-10 sm:mb-12 text-right pr-6 sm:pr-8 md:pr-12 drop-shadow-[0_10px_20px_rgba(248,178,78,0.3)]">
                      SPACE
                    </h1>
                  </m.div>

                  <m.div
                    className="absolute -top-2 sm:-top-4 right-0 sm:right-[10%] md:right-[20%] text-[10px] sm:text-sm font-black"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-8 sm:w-12 h-[2px] bg-[#F8B24E]" />
                      <span className="whitespace-nowrap text-[#FBC774]">
                        FOR YOUR TINY APT
                      </span>
                    </div>
                  </m.div>
                </div>

                {/* Subtext Grid */}
                <m.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 max-w-5xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <div className="md:col-span-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-white/90">
                      We&#39;re not another storage company. We&#39;re the
                      <span className="font-black text-[#F8B24E]">
                        {" "}
                        spatial revolution{" "}
                      </span>
                      your 400sq ft needs. Manhattan&#39;s answer to the storage
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
                </m.div>

                {/* CTA Section with error handling */}
                <m.div
                  className="mt-16 sm:mt-20 md:ml-[15%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 max-w-xl"
                  >
                    <div className="flex-1">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full h-14 sm:h-16 bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 text-base sm:text-lg font-bold focus:border-[#F8B24E] transition-colors"
                        required
                        disabled={isSubmitting}
                      />
                      <AnimatePresence>
                        {emailError && (
                          <m.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[#F8B24E] text-sm mt-2"
                          >
                            {emailError}
                          </m.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 sm:h-16 px-8 sm:px-12 bg-[#F8B24E] text-[#0F1A7D] hover:bg-[#F5A02C] font-black text-base sm:text-lg shadow-[8px_8px_0px_rgba(255,255,255,0.1)] sm:shadow-[10px_10px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
                    >
                      {isSubmitting ? "PROCESSING..." : "CLAIM SPACE"}
                      {!isSubmitting && (
                        <ArrowUpRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                      )}
                    </Button>
                  </form>

                  <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 sm:mt-6 text-xs sm:text-sm text-[#FBC774] font-bold">
                    <span>$55.00/mo</span>
                    <span className="text-white/30">•</span>
                    <span>2hr delivery</span>
                    <span className="text-white/30">•</span>
                    <span>Cancel anytime</span>
                  </div>
                </m.div>
              </m.div>
            </div>
          </div>

          <ScrollIndicator
            shouldReduceMotion={shouldReduceMotion || isMobile}
          />
        </section>

        {/* Lazy loaded sections with loading states */}
        <Suspense
          fallback={<div className="h-96 bg-[#1724B6] animate-pulse" />}
        >
          <StatsSection />
        </Suspense>

        <Suspense
          fallback={<div className="h-96 bg-[#0F1A7D] animate-pulse" />}
        >
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
          <PricingSection />
        </Suspense>

        {/* NYC Section - Optimized animations */}
        <section className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#1724B6]">
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-black tracking-tighter mb-12 sm:mb-16">
              NYC
              <br />
              <span className="text-[#F8B24E] drop-shadow-[0_10px_20px_rgba(248,178,78,0.3)]">
                EXCLUSIVE
              </span>
            </h2>
          </m.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "MANHATTAN", status: "LIVE", time: "2HR DELIVERY" },
              { name: "BROOKLYN", status: "LIVE", time: "4HR DELIVERY" },
              { name: "QUEENS", status: "LIVE", time: "NEXT DAY" },
            ].map((borough, i) => (
              <m.div
                key={borough.name}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion || isMobile ? 0 : i * 0.05,
                  duration: 0.3,
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={shouldReduceMotion || isMobile ? {} : { y: -5 }}
              >
                <div className="p-6 sm:p-8 border-2 border-[#F8B24E]/30 bg-[#0F1A7D] hover:bg-[#F8B24E] hover:text-[#0F1A7D] transition-all duration-300 group transform-gpu">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-3 h-3 bg-[#10B981] group-hover:bg-[#0F1A7D] animate-pulse" />
                    <span className="text-[10px] sm:text-xs tracking-widest text-[#10B981] group-hover:text-[#0F1A7D] font-black">
                      {borough.status}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-1 sm:mb-2">
                    {borough.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 group-hover:text-[#0F1A7D]/70 font-bold">
                    {borough.time}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* Final CTA - Optimized with lazy image */}
        <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#F8B24E] to-[#F5A02C]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#0F1A7D] opacity-10" />
            <Image
              src="https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=1200&h=800&fit=crop&q=50"
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
            <m.h2
              className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-6 sm:mb-8 text-[#0F1A7D]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: shouldReduceMotion || isMobile ? 0 : 0.5,
              }}
              viewport={{ once: true }}
            >
              YOUR SPACE
              <br />
              <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.5)]">
                AWAITS
              </span>
            </m.h2>

            <m.form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion || isMobile ? 0 : 0.2 }}
              viewport={{ once: true }}
            >
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full h-14 sm:h-16 bg-white/90 border-2 border-[#0F1A7D] text-[#0F1A7D] placeholder:text-[#0F1A7D]/50 text-base sm:text-lg font-bold mb-4 focus:bg-white transition-colors"
                required
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 sm:h-16 bg-[#0F1A7D] text-white hover:bg-[#1724B6] font-black text-base sm:text-lg shadow-[0_8px_0px_rgba(15,26,125,0.3)] hover:translate-y-[-2px] hover:shadow-[0_10px_0px_rgba(15,26,125,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
              >
                {isSubmitting ? "PROCESSING..." : "CLAIM YOUR SPACE NOW"}
              </Button>
            </m.form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-6 sm:px-8 md:px-12 border-t-2 border-[#F8B24E]/20 bg-[#0F1A7D]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl sm:text-2xl font-black tracking-tighter text-[#F8B24E]">
              SORT
            </div>
            <div className="flex gap-6 sm:gap-8 text-[10px] sm:text-xs tracking-widest text-white/60 font-bold">
              <Link href="#" className="hover:text-[#F8B24E] transition-colors">
                TERMS
              </Link>
              <Link href="#" className="hover:text-[#F8B24E] transition-colors">
                PRIVACY
              </Link>
              <Link href="#" className="hover:text-[#F8B24E] transition-colors">
                CONTACT
              </Link>
            </div>
            <div className="text-[10px] sm:text-xs text-white/40 font-bold">
              © 2025 NYC
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}
