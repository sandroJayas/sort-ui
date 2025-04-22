"use client";

import { SortLogo } from "../home/SortLogo";
import { User } from "lucide-react";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardNavbar() {
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    setOpen(false);
    signOut({ callbackUrl: "/" });
  };
  return (
    <nav className="top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <SortLogo />

          {/* Desktop Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center hidden md:flex">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/profile/personal-information"
                  className="text-gray-600 hover:text-black transition-colors h-8 content-center"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href=""
                  className="text-gray-600 hover:text-black transition-colors h-8 content-center text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center md:hidden">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left content-center">
                <VisuallyHidden>
                  <DrawerTitle>Menu</DrawerTitle>
                </VisuallyHidden>
                <Link
                  href="/profile/personal-information"
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Separator />
                <Link
                  href=""
                  className="text-gray-600 hover:text-black transition-colors h-18 content-center text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
