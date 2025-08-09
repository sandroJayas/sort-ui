"use client";

import React, { useCallback, memo, useState, useEffect } from "react";
import {
  Menu,
  LogOut,
  UserCircle,
  ChevronDown,
  Package,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  Sparkles,
  X,
  Shield,
  ArrowRight,
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ============= Types =============
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  badge?: string;
  icon?: React.ReactNode;
}

interface NotificationData {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

// ============= Components =============
const NavLink = memo<NavLinkProps>(
  ({ href, children, isActive, onClick, badge, icon }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2",
        isActive
          ? "text-[#1742B1] bg-[#1742B1]/10"
          : "text-[#333333] hover:text-[#1742B1] hover:bg-[#F5F7FA]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20",
      )}
      tabIndex={0}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
      {badge && (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#FF9900] text-white rounded-full">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#1742B1] rounded-full" />
      )}
    </Link>
  ),
);

NavLink.displayName = "NavLink";

const MobileNavLink = memo<NavLinkProps>(
  ({ href, children, icon, onClick, isActive, badge }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive
          ? "bg-[#1742B1]/10 text-[#1742B1]"
          : "text-[#333333] hover:bg-[#F5F7FA]",
      )}
      tabIndex={0}
    >
      {icon && (
        <span
          className={cn(
            "transition-colors",
            isActive
              ? "text-[#1742B1]"
              : "text-[#333333] group-hover:text-[#1742B1]",
          )}
        >
          {icon}
        </span>
      )}
      <span className="font-medium flex-1">{children}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-[#FF9900] text-white rounded-full">
          {badge}
        </span>
      )}
      {isActive && <ArrowRight className="w-4 h-4 text-[#1742B1]" />}
    </Link>
  ),
);

MobileNavLink.displayName = "MobileNavLink";

const NotificationItem: React.FC<{ notification: NotificationData }> = ({
  notification,
}) => {
  const iconColors = {
    info: "bg-[#1742B1]/10 text-[#1742B1]",
    success: "bg-green-100 text-green-600",
    warning: "bg-[#FF9900]/10 text-[#FF9900]",
  };

  return (
    <div
      className={cn(
        "p-3 hover:bg-[#F5F7FA] transition-colors cursor-pointer",
        !notification.read && "bg-[#1742B1]/5",
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            iconColors[notification.type],
          )}
        >
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#111111]">
            {notification.title}
          </p>
          <p className="text-xs text-[#333333] mt-0.5">
            {notification.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-[#FF9900] rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
};

// ============= Main Component =============
export const DashboardNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();
  const { logout } = useLogout();
  const { data: user } = useUser();
  const pathname = usePathname();

  // Mock notifications (replace with real data)
  const notifications: NotificationData[] = [
    {
      id: "1",
      title: "Box Ready for Pickup",
      description: "Your storage box #1234 is ready",
      time: "2 hours ago",
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "Subscription Renewal",
      description: "Your plan renews in 3 days",
      time: "1 day ago",
      read: false,
      type: "warning",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // User initials
  const userInitials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
      : user?.email?.[0].toUpperCase() || "U";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200"
          : "bg-white border-b border-gray-200",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo with Home Link */}
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
                icon={<Package className="w-4 h-4" />}
              >
                Storage
              </NavLink>
              <NavLink
                href="/subscription"
                isActive={pathname.startsWith("/subscription")}
                icon={<CreditCard className="w-4 h-4" />}
                badge={
                  user && user?.subscription_status !== "active"
                    ? "!"
                    : undefined
                }
              >
                Subscription
              </NavLink>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex relative p-2 text-[#333333] hover:text-[#1742B1] hover:bg-[#F5F7FA] rounded-lg transition-all duration-200"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF9900] rounded-full" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#111111]">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-[#FF9900] text-white rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-[#333333]">
                        No new notifications
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <Link
                    href="/notifications"
                    className="block text-center text-sm text-[#1742B1] hover:text-[#1742B1]/80 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <button className="hidden md:flex p-2 text-[#333333] hover:text-[#1742B1] hover:bg-[#F5F7FA] rounded-lg transition-all duration-200">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#333333] hover:bg-[#F5F7FA] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1742B1] to-[#1742B1]/80 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {userInitials}
                    </span>
                  </div>
                  <span className="hidden lg:block text-[#111111]">
                    {user?.first_name || "Account"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#333333]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="font-normal px-2 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1742B1] to-[#1742B1]/80 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {userInitials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-[#333333] truncate">
                        {user?.email}
                      </p>
                      {user?.subscription_status === "active" && (
                        <div className="flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3 text-[#FF9900]" />
                          <span className="text-xs font-medium text-[#FF9900]">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/personal-information"
                      className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg"
                    >
                      <UserCircle className="w-4 h-4 text-[#333333]" />
                      <span className="text-sm">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/security"
                      className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg"
                    >
                      <Shield className="w-4 h-4 text-[#333333]" />
                      <span className="text-sm">Security</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg"
                    >
                      <Settings className="w-4 h-4 text-[#333333]" />
                      <span className="text-sm">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-2 py-2 text-red-600 focus:text-red-600 cursor-pointer rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  className="md:hidden relative p-2 text-[#333333] hover:bg-[#F5F7FA] rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20"
                  aria-label="Mobile menu"
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <Menu className="w-5 h-5" strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF9900] rounded-full" />
                  )}
                </button>
              </DrawerTrigger>
              <DrawerContent className="h-full">
                <DrawerHeader className="border-b border-gray-200 pb-4 bg-[#F5F7FA]">
                  <div className="flex items-center justify-between">
                    <DrawerTitle className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1742B1] to-[#1742B1]/80 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {userInitials}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-[#111111]">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-[#333333]">{user?.email}</p>
                        {user?.subscription_status === "active" && (
                          <div className="flex items-center gap-1 mt-1">
                            <Sparkles className="w-3 h-3 text-[#FF9900]" />
                            <span className="text-xs font-medium text-[#FF9900]">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>
                    </DrawerTitle>
                    <button
                      onClick={closeDrawer}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-[#333333]" />
                    </button>
                  </div>
                </DrawerHeader>

                <nav
                  className="p-4 space-y-1 overflow-y-auto"
                  role="menu"
                  aria-label="Mobile navigation"
                >
                  <MobileNavLink
                    href="/storage"
                    onClick={closeDrawer}
                    icon={<Package className="w-5 h-5" />}
                    isActive={pathname.startsWith("/storage")}
                  >
                    Storage
                  </MobileNavLink>
                  <MobileNavLink
                    href="/subscription"
                    onClick={closeDrawer}
                    icon={<CreditCard className="w-5 h-5" />}
                    isActive={pathname.startsWith("/subscription")}
                    badge={
                      user && user?.subscription_status !== "active"
                        ? "!"
                        : undefined
                    }
                  >
                    Subscription
                  </MobileNavLink>
                  <MobileNavLink
                    href="/notifications"
                    onClick={closeDrawer}
                    icon={<Bell className="w-5 h-5" />}
                    badge={unreadCount > 0 ? String(unreadCount) : undefined}
                  >
                    Notifications
                  </MobileNavLink>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Account
                    </p>
                    <MobileNavLink
                      href="/profile/personal-information"
                      onClick={closeDrawer}
                      icon={<UserCircle className="w-5 h-5" />}
                    >
                      Profile Settings
                    </MobileNavLink>
                    <MobileNavLink
                      href="/profile/security"
                      onClick={closeDrawer}
                      icon={<Shield className="w-5 h-5" />}
                    >
                      Security
                    </MobileNavLink>
                    <MobileNavLink
                      href="/settings"
                      onClick={closeDrawer}
                      icon={<Settings className="w-5 h-5" />}
                    >
                      Settings
                    </MobileNavLink>
                    <MobileNavLink
                      href="/help"
                      onClick={closeDrawer}
                      icon={<HelpCircle className="w-5 h-5" />}
                    >
                      Help & Support
                    </MobileNavLink>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
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
