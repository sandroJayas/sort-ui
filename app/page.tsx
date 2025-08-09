"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -500]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const heroRotate = useTransform(scrollY, [0, 1000], [0, -5]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 25, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 40);
      mouseY.set((clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.cdnfonts.com/css/aeonik");

        * {
          font-family:
            "Aeonik",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        body {
          background: #000;
          overflow-x: hidden;
        }

        .text-gradient {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #667eea 100%
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 10s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .brutal-shadow {
          box-shadow: 10px 10px 0px rgba(102, 126, 234, 0.3);
        }

        .overflow-bleed {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
        }

        ::selection {
          background: #667eea;
          color: white;
        }

        .distort-text {
          transform: perspective(400px) rotateY(-5deg);
        }
      `}</style>

      <div ref={containerRef} className="bg-black text-white">
        {/* Navigation - Minimal and Floating */}
        <motion.nav
          className="fixed top-0 left-0 w-full z-50 mix-blend-difference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="flex justify-between items-center p-8 md:p-12">
            <motion.div
              className="text-3xl md:text-4xl font-black tracking-tighter"
              whileHover={{ scale: 0.95 }}
            >
              SORT
            </motion.div>

            <div className="flex items-center gap-8">
              <motion.button
                className="relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
              >
                <span className="relative z-10 px-8 py-3 border border-white/20 rounded-full block backdrop-blur-sm bg-white/5 font-medium">
                  Enter
                </span>
                <motion.div
                  className="absolute inset-0 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span className="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero - Unconventional Layout */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden"
        >
          <motion.div
            className="absolute -right-1/4 top-0 w-[150%] h-full"
            style={{
              y: heroY,
              scale: heroScale,
              rotate: heroRotate,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1514565131-fce0801e3485?w=1920&h=1080&fit=crop"
              alt="NYC"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black" />
          </motion.div>

          <div className="relative z-10 w-full">
            <div className="px-8 md:px-12 py-32">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Floating Badge */}
                <motion.div
                  className="inline-block mb-8"
                  style={{ x: smoothMouseX, y: smoothMouseY }}
                >
                  <div className="px-6 py-2 border border-white/10 rounded-full backdrop-blur-sm bg-white/5">
                    <span className="text-xs tracking-widest font-light">
                      NYC ONLY — 2025
                    </span>
                  </div>
                </motion.div>

                {/* Massive Typography */}
                <div className="relative">
                  <motion.h1
                    className="text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter mb-8"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    INFINITE
                  </motion.h1>

                  <motion.div
                    className="overflow-bleed"
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter text-gradient mb-12 text-right pr-8 md:pr-12">
                      SPACE
                    </h1>
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 right-0 md:right-[20%] text-sm font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-2">
                      <Minus className="w-8 h-[1px]" />
                      <span>FOR YOUR TINY APT</span>
                    </div>
                  </motion.div>
                </div>

                {/* Subtext Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="md:col-span-2">
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300">
                      We&#39;re not another storage company. We&#39;re the
                      spatial revolution your 400sq ft needs. Manhattan&#39;s
                      answer to the storage crisis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm uppercase tracking-wider">
                        Live in NYC
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                      <span className="text-sm uppercase tracking-wider text-gray-500">
                        Other cities Soon
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Section - Offset */}
                <motion.div
                  className="mt-20 md:ml-[15%]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row gap-4 max-w-xl"
                  >
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="flex-1 h-16 bg-transparent border-white/20 text-white placeholder:text-white/30 text-lg font-light rounded-none"
                      required
                    />
                    <Button
                      type="submit"
                      className="h-16 px-12 bg-white text-black hover:bg-white/90 font-bold text-lg rounded-none brutal-shadow"
                    >
                      CLAIM SPACE
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>

                  <div className="flex gap-8 mt-6 text-sm text-gray-500">
                    <span>$55.00/mo</span>
                    <span>•</span>
                    <span>2hr delivery</span>
                    <span>•</span>
                    <span>Cancel anytime</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-8 md:left-12"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-[1px] h-20 bg-white/20" />
          </motion.div>
        </section>

        {/* Stats - Full Bleed */}
        <section className="overflow-bleed py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="relative px-8 md:px-12">
            <motion.div
              className="flex flex-col md:flex-row gap-16 md:gap-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              {[
                { value: "10K", label: "NYC UNITS", suffix: "+" },
                { value: "2", label: "HOUR DELIVERY", suffix: "HR" },
                { value: "99", label: "UPTIME", suffix: "%" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-[8vw] md:text-[6vw] font-black tracking-tighter">
                      {stat.value}
                    </span>
                    <span className="text-2xl md:text-3xl font-light text-gray-500">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-600 mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features - Asymmetric Grid */}
        <section className="py-32 px-8 md:px-12">
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter mb-4">
              THE PROCESS
            </h2>
            <div className="w-20 h-[2px] bg-white" />
          </motion.div>

          <div className="space-y-32">
            {[
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
            ].map((feature, i) => (
              <motion.div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${
                  feature.align === "right" ? "md:ml-[20%]" : "md:mr-[20%]"
                }`}
                initial={{
                  opacity: 0,
                  x: feature.align === "right" ? 100 : -100,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
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
                  <motion.button
                    className="group flex items-center gap-2 text-sm tracking-wider"
                    whileHover={{ x: 10 }}
                  >
                    <span>LEARN MORE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </div>
                <div
                  className={`relative h-[400px] ${feature.align === "right" ? "md:order-1" : ""}`}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-4 -right-4 w-full h-full border border-white/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing - Brutal Design */}
        <section className="overflow-bleed py-32 bg-white text-black">
          <div className="px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <motion.h2
                  className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  SIMPLE
                  <br />
                  <span className="text-gray-300">PRICING</span>
                </motion.h2>

                <div className="space-y-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black">$19</span>
                    <span className="text-2xl text-gray-500">.99/mo</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Unlimited boxes",
                      "Free delivery & pickup",
                      "Climate controlled",
                      "2hr Manhattan returns",
                      "$1 per sq ft",
                      "Cancel anytime",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-8 h-[1px] bg-black" />
                        <span className="text-lg font-light">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    className="mt-12 px-12 py-4 bg-black text-white font-bold text-lg hover:bg-gray-900 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
                  >
                    START NOW
                  </motion.button>
                </div>
              </div>

              <div className="relative h-[600px] md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=1000&fit=crop"
                  alt="Storage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* NYC Section - Map Style */}
        <section className="py-32 px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter mb-16">
              NYC
              <br />
              <span className="text-gradient">EXCLUSIVE</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "MANHATTAN", status: "LIVE", time: "2HR DELIVERY" },
              { name: "BROOKLYN", status: "LIVE", time: "4HR DELIVERY" },
              { name: "QUEENS", status: "LIVE", time: "NEXT DAY" },
            ].map((borough, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="p-8 border border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs tracking-widest text-green-500">
                      {borough.status}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter mb-2">
                    {borough.name}
                  </h3>
                  <p className="text-sm text-gray-500">{borough.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 p-8 border border-white/10 backdrop-blur-sm bg-white/5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-sm tracking-widest text-gray-500">
              EXPANDING 2025: LOS ANGELES • SAN FRANCISCO • CHICAGO • BOSTON •
              MIAMI
            </p>
          </motion.div>
        </section>

        {/* Final CTA - Full Screen */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=1920&h=1080&fit=crop"
              alt="NYC Night"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </motion.div>

          <div className="relative z-10 text-center px-8">
            <motion.h2
              className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              YOUR SPACE
              <br />
              <span className="text-gradient p-1">AWAITS</span>
            </motion.h2>

            <motion.form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full h-16 bg-white/10 border-white/20 text-white placeholder:text-white/30 text-lg font-light rounded-none mb-4"
                required
              />
              <Button
                type="submit"
                className="w-full h-16 bg-white text-black hover:bg-white/90 font-black text-lg rounded-none"
              >
                CLAIM YOUR SPACE NOW
              </Button>
            </motion.form>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-8 px-8 md:px-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-black tracking-tighter">SORT</div>
            <div className="flex gap-8 text-xs tracking-widest text-gray-600">
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
            <div className="text-xs text-gray-600">© 2025 NYC</div>
          </div>
        </footer>
      </div>
    </>
  );
}
