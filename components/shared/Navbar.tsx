"use client";

import { SortLogo } from "../home/SortLogo";
import { Menu, User } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";

export function DashboardNavbar() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { logout } = useLogout();

  const handleLogout = () => {
    setOpen(false);
    queryClient.clear();
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#DADCE0]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <SortLogo />
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-[#333333] hover:text-[#1742B1] transition-colors duration-200 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/storage"
                className="text-[#333333] hover:text-[#1742B1] transition-colors duration-200 text-sm font-medium"
              >
                Storage
              </Link>
              <Link
                href="/subscription"
                className="text-[#333333] hover:text-[#1742B1] transition-colors duration-200 text-sm font-medium"
              >
                Subscription
              </Link>
            </div>
          </div>

          {/* Desktop Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex w-10 h-10 bg-[#F5F7FA] rounded-full items-center justify-center hover:bg-[#DADCE0] transition-all duration-200">
                <User className="w-5 h-5 text-[#333333]" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile/personal-information"
                  className="text-[#333333] hover:text-[#1742B1] transition-colors cursor-pointer"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <button className="md:hidden w-10 h-10 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                <Menu className="w-5 h-5 text-[#333333]" strokeWidth={1.5} />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <VisuallyHidden>
                  <DrawerTitle>Menu</DrawerTitle>
                </VisuallyHidden>
                <div className="space-y-1">
                  <Link
                    href="/profile/personal-information"
                    className="block py-3 text-[#333333] hover:text-[#1742B1] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Separator />
                  <Link
                    href="/dashboard"
                    className="block py-3 text-[#333333] hover:text-[#1742B1] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Separator />
                  <Link
                    href="/storage"
                    className="block py-3 text-[#333333] hover:text-[#1742B1] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Storage
                  </Link>
                  <Separator />
                  <Link
                    href="/subscription"
                    className="block py-3 text-[#333333] hover:text-[#1742B1] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Subscription
                  </Link>
                  <Separator />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
