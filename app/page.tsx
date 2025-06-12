"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, BoxIcon } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { signIn } from "next-auth/react";
import { SortButton, SortCTAButton } from "@/components/sort/SortButton";

// ——————————————————————————
// Static data
// ——————————————————————————
const TRENDING_SHOWS = [
  {
    id: 1,
    title: "Raleigh",
    image: "/cities/raleigh.png",
    available: true,
  },
  {
    id: 2,
    title: "Charlotte",
    image: "/cities/charlotte.png",
    available: false,
  },
  {
    id: 3,
    title: "New York",
    image: "/cities/new-york.png",
    available: false,
  },
];

const FEATURES = [
  {
    id: "box",
    title: "Boxes Delivered to You",
    description: "We ship Sort storage boxes right to your door. For free.",
    iconBg: "bg-[#F8F9FA]",
    icon: (
      <Image
        src="/cards/card-1.svg"
        alt="Boxes Delivered to You"
        width={65}
        height={65}
      />
    ),
  },
  {
    id: "pack",
    title: "Pack on Your Schedule",
    description:
      "Take your time: fill each box with clothes, books, keepsakes. Anywhere, anytime.",
    iconBg: "bg-[#178FB1]/10",
    icon: (
      <Image
        src="/cards/card-2.svg"
        alt="Pack on Your Schedule"
        width={65}
        height={65}
      />
    ),
  },
  {
    id: "store",
    title: "We Pick Up & Store",
    description:
      "Schedule a pick-up and we'll collect your boxes and transport them to our secure facility.",
    iconBg: "bg-[#FF9900]/10",
    icon: (
      <Image
        src="/cards/card-3.svg"
        alt="We Pick Up & Store"
        width={65}
        height={65}
      />
    ),
  },
  {
    id: "retrieve",
    title: "Retrieve Whenever You Need",
    description:
      "Need something back? Request a delivery and we'll bring any box straight to you. For free.",
    iconBg: "bg-[#1742B1]/10",
    icon: (
      <Image
        src="/cards/card-4.svg"
        alt="Retrieve Whenever You Need"
        width={65}
        height={65}
      />
    ),
  },
];

const FAQ_ITEMS = [
  {
    q: "What is Sort?",
    a:
      "Sort is a convenient, on-demand storage service that lets you securely store personal items without ever visiting a storage unit. " +
      "We deliver empty boxes to your door, you fill them at your convenience, and we handle pickup and storage. " +
      "When you need something back, just request a return. It's that simple.",
  },
  {
    q: "How much does Sort cost?",
    a: "$19.99/month + $1/sq ft/month",
  },
  {
    q: "What can I store?",
    a:
      "You can store almost anything with Sort - from small items like clothes, books, or decorations to larger " +
      "belongings like lamps, chairs, or even a couch.",
  },
  {
    q: "How do I cancel?",
    a: "Log into your account, visit Subscription settings, and select “Cancel Plan”. No fees, no hassle.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroInView = useInView(heroRef, { once: true });
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Better way to get form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) return;

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate signup");
      }

      const { authUrl } = await response.json();

      // Redirect to Auth0 with pre-filled email
      window.location.href = authUrl;
    } catch (error) {
      console.error("Signup error:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="font-sans">
      {/* Hero */}
      <motion.header style={{ opacity: headerOpacity }} className="relative">
        <div
          ref={heroRef}
          className="h-[80vh] md:h-[85vh] bg-cover bg-center relative"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23, 66, 177, 0.1), rgba(23, 66, 177, 0.2)), url('/hero-storage.jpg')",
            backgroundColor: "#F8F9FA", // Fallback
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
          <div className="container mx-auto px-8 pt-8 flex justify-between items-center relative z-10">
            <Logo />
            <SortButton
              className="px-6 py-2"
              onClick={() => signIn("auth0", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </SortButton>
          </div>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white max-w-2xl drop-shadow-lg">
              All Your Stuff, Stored from Home.
            </h1>
            <p className="text-lg md:text-2xl mb-6 text-gray-100 max-w-xl drop-shadow">
              Starts at $19.99. Cancel at any time.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 w-full max-w-xl"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-grow h-14 bg-white border-0 shadow-md text-[#212121] placeholder:text-[#6C757D]"
                required
              />
              <SortCTAButton type="submit" className="h-14 px-6">
                Get Started
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      duration: 1.5,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <ChevronRight className="ml-2 h-6 w-6" />
                </motion.div>
              </SortCTAButton>
            </form>
          </motion.div>
        </div>
      </motion.header>

      {/* Promo Banner */}
      <div
        className="bg-gradient-to-r from-[#1742B1] to-[#178FB1] py-6"
        aria-label="Promotional banner"
      >
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#FF9900] to-[#FFC107] rounded-full shadow-md">
                <BoxIcon className="fill-white stroke-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#212121]">
                  Store for only $19.99
                </h3>
                <p className="text-[#6C757D]">
                  Our most affordable, totally unrestricted plan.
                </p>
              </div>
            </div>
            <SortButton>Learn more</SortButton>
          </div>
        </div>
      </div>

      {/* Availabilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#212121]">
            Available in These Cities
          </h2>
          <div className="flex justify-around gap-6 overflow-x-auto pb-2 scrollbar-none">
            {TRENDING_SHOWS.map((s, i) => (
              <div
                key={s.id}
                className="w-56 flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group relative"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  width={224}
                  height={224}
                  className="block"
                />

                {/* Hover overlay if unavailable */}
                {!s.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-60 flex items-center justify-center transition-opacity duration-300 z-10">
                    <span className="text-white text-lg font-semibold">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="p-4 bg-white relative z-0">
                  <span className="inline-block bg-[#178FB1] text-white rounded-full w-7 h-7 text-center leading-7 mr-2 shadow-sm">
                    {i + 1}
                  </span>
                  <span className="font-medium text-[#212121]">{s.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#212121]">
            Why Choose Sort?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f) => (
              <motion.div
                key={f.id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div
                  className={`mx-auto w-20 h-20 mb-4 rounded-full ${f.iconBg} flex items-center justify-center shadow-sm`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#212121]">
                  {f.title}
                </h3>
                <p className="text-[#6C757D]">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-8 max-w-2xl">
          <motion.h2
            ref={faqRef}
            className="text-3xl font-bold text-center mb-10 text-[#212121]"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map(({ q, a }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem
                    value={`faq-${idx}`}
                    className="border rounded-lg shadow-sm"
                  >
                    <AccordionTrigger className="w-full px-6 py-4 bg-[#F8F9FA] rounded-t-lg hover:bg-gray-100 text-left text-lg font-medium text-[#212121] transition-colors duration-200">
                      {q}
                    </AccordionTrigger>
                    <AnimatePresence>
                      <AccordionContent className="px-6 py-4 bg-white rounded-b-lg text-[#6C757D]">
                        {a}
                      </AccordionContent>
                    </AnimatePresence>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-lg md:text-xl mb-5 text-[#212121]">
              Ready to store? Enter your email to create or restart your
              membership.
            </p>
            <form
              className="flex flex-col md:flex-row max-w-3xl mx-auto gap-2"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                className="h-14 bg-white border border-gray-200 rounded-lg px-4 flex-grow text-[#212121] placeholder:text-[#6C757D] shadow-sm focus:shadow-md transition-shadow duration-200"
                required
              />
              <motion.div whileTap={{ scale: 0.95 }}>
                <SortCTAButton type="submit" className="h-14 text-xl px-8">
                  Get Started
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                      transition: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        duration: 1.5,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ChevronRight className="ml-2 h-6 w-6" />
                  </motion.div>
                </SortCTAButton>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212121] text-[#6C757D] py-12">
        <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About", "Careers", "Press", "Blog"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {["Help Centre", "Privacy Policy", "Terms of Use", "Contact"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors duration-200"
                    >
                      {l}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1 md:col-span-2">
            <div className="flex items-center justify-center sm:justify-start h-full">
              <div className="text-center sm:text-left">
                <Logo isLight />
                <p className="text-sm mt-4">
                  &copy; {new Date().getFullYear()} Sort, Inc. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ——————————————————————————
// Logo component - Updated
// ——————————————————————————
function Logo({ isLight = false }: { isLight?: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-10 h-10 ${isLight ? "bg-white" : "bg-[#1742B1]"} rounded-lg flex items-center justify-center shadow-sm`}
      >
        <BoxIcon
          className={`w-6 h-6 ${isLight ? "text-[#1742B1]" : "text-white"}`}
        />
      </div>
      <span
        className={`text-2xl font-bold ${isLight ? "text-white" : "text-[#1742B1]"}`}
      >
        Sort
      </span>
    </div>
  );
}
