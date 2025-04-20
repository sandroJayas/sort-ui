"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SortLogo } from "@/components/home/SortLogo";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
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

          {/* Mobile Menu */}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <MenuIcon className="md:hidden" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left content-center">
                <VisuallyHidden>
                  <DrawerTitle>Menu</DrawerTitle>
                </VisuallyHidden>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Separator />
                <Link
                  href="#about"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <Separator />
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  Features
                </Link>
                <Separator />
                <Link
                  href="#future"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  Future
                </Link>
                <Separator />
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </Link>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
