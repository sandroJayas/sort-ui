"use client";

import React, { useCallback, memo } from "react";
import {
  Menu,
  User,
  LogOut,
  UserCircle,
  ChevronDown,
  Package,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = memo<NavLinkProps>(({ href, children, isActive, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
      ${
        isActive
          ? "text-[#1742B1] bg-[#1742B1]/5"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }
      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20
    `}
    tabIndex={0}
  >
    {children}
    {isActive && (
      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1742B1] rounded-full" />
    )}
  </Link>
));

NavLink.displayName = "NavLink";

interface MobileNavLinkProps extends NavLinkProps {
  icon?: React.ReactNode;
}

const MobileNavLink = memo<MobileNavLinkProps>(
  ({ href, children, icon, onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
      tabIndex={0}
    >
      {icon && (
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
          {icon}
        </span>
      )}
      <span className="font-medium">{children}</span>
    </Link>
  ),
);

MobileNavLink.displayName = "MobileNavLink";

export const DashboardNavbar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { logout } = useLogout();
  const { data } = useUser();
  const pathname = usePathname();

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
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <SortLogo />

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1"
              role="menubar"
              aria-label="Desktop navigation"
            >
              <NavLink
                href="/storage"
                isActive={pathname.startsWith("/storage")}
              >
                Storage
              </NavLink>
              <NavLink
                href="/subscription"
                isActive={pathname.startsWith("/subscription")}
              >
                Subscription
              </NavLink>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Bell - placeholder for future */}
            <button className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1742B1] to-[#14399F] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <span className="hidden lg:block">Account</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {data?.first_name + " " + data?.last_name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {data?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile/personal-information"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <UserCircle className="w-4 h-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20"
                  aria-label="Mobile menu"
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <Menu className="w-5 h-5" strokeWidth={2} />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-b border-gray-100 pb-4">
                  <DrawerTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1742B1] to-[#14399F] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                  </DrawerTitle>
                </DrawerHeader>
                <nav
                  className="p-4 space-y-1"
                  role="menu"
                  aria-label="Mobile navigation"
                >
                  <MobileNavLink
                    href="/storage"
                    onClick={closeDrawer}
                    icon={<Package className="w-5 h-5" />}
                  >
                    Storage
                  </MobileNavLink>
                  <MobileNavLink
                    href="/subscription"
                    onClick={closeDrawer}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    }
                  >
                    Subscription
                  </MobileNavLink>

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <MobileNavLink
                      href="/profile/personal-information"
                      onClick={closeDrawer}
                      icon={<UserCircle className="w-5 h-5" />}
                    >
                      Profile Settings
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};
