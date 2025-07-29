"use client";

import React, { useCallback, memo } from "react";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { SortLogo } from "../home/SortLogo";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = memo<NavLinkProps>(({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-[#333333] hover:text-[#1742B1] transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 rounded px-2 py-1"
    tabIndex={0}
  >
    {children}
  </Link>
));

NavLink.displayName = "NavLink";

interface MobileNavLinkProps extends NavLinkProps {
  isLast?: boolean;
}

const MobileNavLink = memo<MobileNavLinkProps>(
  ({ href, children, onClick, isLast }) => (
    <>
      <Link
        href={href}
        onClick={onClick}
        className="block py-3 text-[#333333] hover:text-[#1742B1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 rounded px-2"
        tabIndex={0}
      >
        {children}
      </Link>
      {!isLast && <Separator />}
    </>
  ),
);

MobileNavLink.displayName = "MobileNavLink";

export const DashboardNavbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { logout } = useLogout();

  const handleLogout = useCallback(() => {
    setOpen(false);
    queryClient.clear();
    logout();
  }, [queryClient, logout]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-[#DADCE0]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <SortLogo />

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-6"
              role="menubar"
              aria-label="Desktop navigation"
            >
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/storage">Storage</NavLink>
              <NavLink href="/subscription">Subscription</NavLink>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex w-10 h-10 bg-[#F5F7FA] rounded-full items-center justify-center hover:bg-[#DADCE0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <User
                    className="w-5 h-5 text-[#333333]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
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
                <button
                  className="md:hidden w-10 h-10 bg-[#F5F7FA] rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                  aria-label="Mobile menu"
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <Menu
                    className="w-5 h-5 text-[#333333]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <VisuallyHidden>
                    <DrawerTitle>Navigation Menu</DrawerTitle>
                  </VisuallyHidden>
                  <nav
                    className="space-y-1"
                    role="menu"
                    aria-label="Mobile navigation"
                  >
                    <MobileNavLink
                      href="/profile/personal-information"
                      onClick={closeDrawer}
                    >
                      Profile
                    </MobileNavLink>
                    <MobileNavLink href="/dashboard" onClick={closeDrawer}>
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink href="/storage" onClick={closeDrawer}>
                      Storage
                    </MobileNavLink>
                    <MobileNavLink href="/subscription" onClick={closeDrawer}>
                      Subscription
                    </MobileNavLink>
                    <Separator />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-3 text-red-600 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600/20 rounded px-2"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </nav>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};
