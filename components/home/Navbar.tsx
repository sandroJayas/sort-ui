import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SortLogo } from "./SortLogo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <SortLogo />

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#about"
              className="text-gray-600 hover:text-black transition-colors"
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Features
            </Link>
            <Link
              href="#future"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Future
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Login
            </Link>
            <Button className="bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
