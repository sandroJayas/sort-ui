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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { signIn } from "next-auth/react";

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
    iconBg: "white",
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
    iconBg: "from-pink-500 to-pink-400",
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
      "Schedule a pick-up and we’ll collect your boxes and transport them to our secure facility.",
    iconBg: "from-red-500 to-red-400",
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
      "Need something back? Request a delivery and we’ll bring any box straight to you. For free",
    iconBg: "from-blue-500 to-blue-400",
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
      "Sort is a convenient, on-demand storage service that lets you securely store personal items without ever visiting a storage unit." +
      "We deliver empty boxes to your door, you fill them at your convenience, and we handle pickup and storage. " +
      "When you need something back, just request a return. It's that simple.",
  },
  {
    q: "How much does Sort cost?",
    a: "$19.99/month + $1/sq ft/month",
  },
  {
    q: "What can i store?",
    a:
      "You can store almost anything with Sort - from small items like clothes, books, or decorations to larger " +
      "belongings like lamps, chairs, or even a couch. ",
  },
  {
    q: "How do I cancel?",
    a: "Log into your account, visit Subscription settings, and select “Cancel Plan.” No fees, no hassle.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);
  const heroInView = useInView(heroRef, { once: true });
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 });

  return (
    <div className="font-sans">
      {/* Hero */}
      <motion.header style={{ opacity: headerOpacity }} className="relative">
        <div
          ref={heroRef}
          className="h-[80vh] md:h-[85vh] bg-cover bg-center relative"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-8 pt-8 flex justify-between items-center relative z-10">
            <Logo />
            <Button
              className="bg-[#1742B1] hover:bg-[#178FB1] text-white px-6 py-2"
              onClick={() => signIn("auth0", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </Button>
          </div>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white max-w-2xl">
              All Your Stuff, Stored from Home.
            </h1>
            <p className="text-lg md:text-2xl mb-6 text-gray-200 max-w-xl">
              Starts at $19,99. Cancel at any time.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow h-14 bg-gray-100 border-0"
              />
              <Button
                type="submit"
                className="h-14 bg-[#FF9900] hover:bg-[#FFC107] flex items-center px-6"
              >
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
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.header>

      {/* Promo Banner */}
      <div
        className="bg-gradient-to-r from-gray-900 to-[#1742B1] py-6"
        aria-label="Promotional banner"
      >
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#178FB1] rounded-full">
                <BoxIcon className={"fill-white"} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#212121]">
                  Store for only $19.99
                </h3>
                <p className="text-gray-500">
                  Our most affordable, totally unrestricted plan.
                </p>
              </div>
            </div>
            <Button className="bg-[#1742B1] hover:bg-[#178FB1]">
              Learn more
            </Button>
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
                className="w-56 flex-shrink-0 rounded-lg overflow-hidden shadow-lg group relative"
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
                  <span className="inline-block bg-[#178FB1] text-white rounded-full w-7 h-7 text-center leading-7 mr-2">
                    {i + 1}
                  </span>
                  <span className="font-medium">{s.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#212121]">
            Why Choose Sort?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {FEATURES.map((f) => (
              <div key={f.id} className="p-6 bg-white rounded-xl shadow-md">
                <div
                  className={`mx-auto w-20 h-20 mb-4 rounded-full bg-white flex items-center justify-center`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
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
                  <AccordionItem value={`faq-${idx}`} className="border-none">
                    <AccordionTrigger className="w-full px-6 py-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left text-lg font-medium">
                      {q}
                    </AccordionTrigger>
                    <AnimatePresence>
                      <AccordionContent className="px-6 py-4 bg-white rounded-b-lg text-gray-700">
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
            <p className="text-lg md:text-xl mb-5">
              Ready to store? Enter your email to create or restart your
              membership.
            </p>
            <div className="flex flex-col md:flex-row max-w-3xl mx-auto gap-2">
              <Input
                type="email"
                placeholder="Email address"
                className="h-14 bg-[#F8F9FA] border border-[#6C757D]  rounded px-4 flex-grow text-[#212121] placeholder:text-[#6C757D] "
              />
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="h-14 bg-[#FF9900] hover:bg-[#FFC107] text-white text-xl rounded px-8 whitespace-nowrap w-full md:w-auto">
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
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About", "Careers", "Press", "Blog"].map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-white">
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
                    <Link href="#" className="hover:text-white">
                      {l}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="col-span-2 text-center sm:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Sort, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ——————————————————————————
// Icon components
// ——————————————————————————
function Logo() {
  return (
    <svg
      width="150"
      height="80"
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="60"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="64"
        fill="#1742B1"
        fontWeight="bold"
      >
        Sort
      </text>
    </svg>
  );
}
