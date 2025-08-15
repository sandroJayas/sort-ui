import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents FOIT
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: {
    default: "Sort - NYC Storage Solutions",
    template: "%s | Sort Storage",
  },
  description: "Premium storage solution for NYC apartments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
