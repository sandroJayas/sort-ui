"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Minus } from "lucide-react";
import {
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { debounce } from "lodash";

// Lazy load heavy sections
const StatsSection = lazy(() => import("@/components/landing/StatsSection"));
const FeaturesSection = lazy(
  () => import("@/components/landing/FeaturesSection"),
);
const PricingSection = lazy(
  () => import("@/components/landing/PricingSection"),
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollY } = useScroll();

  // Detect mobile for performance optimization only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reduce animation complexity on mobile for performance
  const heroY = useTransform(
    scrollY,
    [0, 1000],
    shouldReduceMotion || isMobile ? [0, 0] : [0, -200],
  );
  const heroScale = useTransform(
    scrollY,
    [0, 500],
    shouldReduceMotion || isMobile ? [1, 1] : [1, 0.9],
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 25, damping: 20 });

  // Debounce mouse move for better performance
  const handleMouseMove = useCallback(
    debounce((e: MouseEvent) => {
      if (shouldReduceMotion || isMobile) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 20);
      mouseY.set((clientY / innerHeight - 0.5) * 20);
    }, 16),
    [mouseX, mouseY, shouldReduceMotion, isMobile],
  );

  useEffect(() => {
    setIsClient(true);
    if (!shouldReduceMotion && !isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        handleMouseMove.cancel();
      };
    }
  }, [handleMouseMove, shouldReduceMotion, isMobile]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      if (!email) return;

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error("Failed to initiate signup");
        const { authUrl } = await response.json();
        window.location.href = authUrl;
      } catch (error) {
        console.error("Signup error:", error);
      }
    },
    [],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
        {/* Navigation - Keep original minimal design */}
        <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
          <div className="flex justify-between items-center p-6 sm:p-8 md:p-12">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter">
              SORT
            </div>

            <button
              className="px-6 sm:px-8 py-2 sm:py-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 font-medium hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base"
              onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
            >
              Enter
            </button>
          </div>
        </nav>

        {/* Hero Section - Maintain experimental design */}
        <section
          ref={heroRef}
          className="relative min-h-[100svh] flex items-center overflow-hidden"
        >
          {isClient && (
            <m.div
              className="absolute -right-1/4 top-0 w-[150%] h-full"
              style={{
                y: heroY,
                scale: heroScale,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1514565131-fce0801e3485?w=1920&h=1080&fit=crop"
                  alt="NYC"
                  fill
                  priority
                  quality={isMobile ? 60 : 75}
                  className="object-cover opacity-40"
                  sizes="150vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black" />
              </div>
            </m.div>
          )}

          <div className="relative z-10 w-full">
            <div className="px-6 sm:px-8 md:px-12 py-24 sm:py-32">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1 }}
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
                  <div className="px-4 sm:px-6 py-1.5 sm:py-2 border border-white/10 rounded-full backdrop-blur-sm bg-white/5">
                    <span className="text-[10px] sm:text-xs tracking-widest font-light">
                      NYC ONLY — 2025
                    </span>
                  </div>
                </m.div>

                {/* Typography - Swiss experimental style maintained */}
                <div className="relative">
                  <m.h1
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mb-6 sm:mb-8"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.8,
                      delay: 0.2,
                    }}
                  >
                    INFINITE
                  </m.h1>

                  <m.div
                    className="w-screen ml-[calc(-50vw+50%)]"
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.8,
                      delay: 0.3,
                    }}
                  >
                    <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-10 sm:mb-12 text-right pr-6 sm:pr-8 md:pr-12">
                      SPACE
                    </h1>
                  </m.div>

                  <m.div
                    className="absolute -top-2 sm:-top-4 right-0 sm:right-[10%] md:right-[20%] text-[10px] sm:text-sm font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Minus className="w-6 sm:w-8 h-[1px]" />
                      <span className="whitespace-nowrap">
                        FOR YOUR TINY APT
                      </span>
                    </div>
                  </m.div>
                </div>

                {/* Subtext Grid - Keep experimental layout */}
                <m.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 max-w-5xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
                >
                  <div className="md:col-span-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-300">
                      We&#39;re not another storage company. We&#39;re the
                      spatial revolution your 400sq ft needs. Manhattan&#39;s
                      answer to the storage crisis.
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm uppercase tracking-wider">
                        Live in NYC
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-500">
                        Other cities Soon
                      </span>
                    </div>
                  </div>
                </m.div>

                {/* CTA Section - Keep sharp corners and experimental design */}
                <m.div
                  className="mt-16 sm:mt-20 md:ml-[15%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 max-w-xl"
                  >
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="flex-1 h-14 sm:h-16 bg-transparent border-white/20 text-white placeholder:text-white/30 text-base sm:text-lg font-light rounded-none"
                      required
                    />
                    <Button
                      type="submit"
                      className="h-14 sm:h-16 px-8 sm:px-12 bg-white text-black hover:bg-white/90 font-bold text-base sm:text-lg rounded-none shadow-[8px_8px_0px_rgba(102,126,234,0.3)] sm:shadow-[10px_10px_0px_rgba(102,126,234,0.3)]"
                    >
                      CLAIM SPACE
                      <ArrowUpRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                    </Button>
                  </form>

                  <div className="flex flex-wrap gap-4 sm:gap-8 mt-5 sm:mt-6 text-xs sm:text-sm text-gray-500">
                    <span>$55.00/mo</span>
                    <span>•</span>
                    <span>2hr delivery</span>
                    <span>•</span>
                    <span>Cancel anytime</span>
                  </div>
                </m.div>
              </m.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <m.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <div className="w-[1px] h-16 sm:h-20 bg-white/20" />
          </m.div>
        </section>

        {/* Lazy loaded sections */}
        <Suspense fallback={<div className="h-96 bg-black" />}>
          <StatsSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-black" />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-white" />}>
          <PricingSection />
        </Suspense>

        {/* NYC Section - Maintain Swiss grid */}
        <section className="py-24 sm:py-32 px-6 sm:px-8 md:px-12">
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-black tracking-tighter mb-12 sm:mb-16">
              NYC
              <br />
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
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
                  delay: shouldReduceMotion || isMobile ? 0 : i * 0.1,
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={shouldReduceMotion || isMobile ? {} : { y: -10 }}
              >
                <div className="p-6 sm:p-8 border border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] sm:text-xs tracking-widest text-green-500">
                      {borough.status}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-1 sm:mb-2">
                    {borough.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {borough.time}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* Final CTA - Keep experimental design */}
        <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=1920&h=1080&fit=crop"
              alt="NYC Night"
              fill
              quality={isMobile ? 50 : 60}
              className="object-cover opacity-30"
              sizes="100vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </div>

          <div className="relative z-10 text-center px-6 sm:px-8">
            <m.h2
              className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: shouldReduceMotion || isMobile ? 0 : 0.8,
              }}
              viewport={{ once: true }}
            >
              YOUR SPACE
              <br />
              <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent p-1">
                AWAITS
              </span>
            </m.h2>

            <m.form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion || isMobile ? 0 : 0.3 }}
              viewport={{ once: true }}
            >
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full h-14 sm:h-16 bg-white/10 border-white/20 text-white placeholder:text-white/30 text-base sm:text-lg font-light rounded-none mb-4"
                required
              />
              <Button
                type="submit"
                className="w-full h-14 sm:h-16 bg-white text-black hover:bg-white/90 font-black text-base sm:text-lg rounded-none"
              >
                CLAIM YOUR SPACE NOW
              </Button>
            </m.form>
          </div>
        </section>

        {/* Footer - Keep minimal Swiss design */}
        <footer className="py-6 sm:py-8 px-6 sm:px-8 md:px-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl sm:text-2xl font-black tracking-tighter">
              SORT
            </div>
            <div className="flex gap-6 sm:gap-8 text-[10px] sm:text-xs tracking-widest text-gray-600">
              <Link href="#" className="hover:text-white transition-colors">
                TERMS
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                PRIVACY
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                CONTACT
              </Link>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600">
              © 2025 NYC
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}
