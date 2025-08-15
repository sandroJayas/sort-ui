// Server Component - No "use client"!
import { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { NYCSection } from "@/components/landing/NYCSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { SchemaMarkup } from "@/components/landing/SchemaMarkup";

export const metadata: Metadata = {
  metadataBase: new URL("https://sort.storage"),
  title: "Sort - Infinite Space for Your Tiny NYC Apartment | 2-Hour Delivery",
  description:
    "NYC-exclusive storage solution with 2-hour Manhattan delivery. Store your belongings with flexible pickup and delivery options. Starting at $55/month.",
  keywords:
    "NYC storage, Manhattan storage, Brooklyn storage, Queens storage, box storage, on-demand storage, apartment storage, self storage NYC",
  authors: [{ name: "Sort Storage" }],
  creator: "Sort",
  publisher: "Sort",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sort.storage",
    siteName: "Sort Storage",
    title: "Sort - Infinite Space for Your Tiny NYC Apartment",
    description:
      "The spatial revolution your 400sq ft needs. 2-hour delivery in Manhattan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sort - NYC Storage Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sort - NYC Storage Solutions",
    description:
      "Premium storage for NYC apartments. $55/month, 2-hour Manhattan delivery.",
    images: ["/og-image.jpg"],
    creator: "@sortstorage",
  },
  alternates: {
    canonical: "https://sort.storage",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function Home() {
  return (
    <>
      <SchemaMarkup />
      <main className="bg-[#0F1A7D] text-white overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PricingSection />
        <NYCSection />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
