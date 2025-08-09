"use client";

import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";
import {
  User,
  Shield,
  CreditCard,
  FileText,
  ChevronRight,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  active: boolean;
}

interface SidebarProps {
  tab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ tab }) => {
  const { data: user, isLoading, error } = useUser();
  const { data: session } = useSession();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        name: "Personal Information",
        href: "personal-information",
        icon: <User className="w-5 h-5" />,
        description: "Manage your profile details",
        active: tab === "personal-information",
      },
      {
        name: "Authorization Form",
        href: "authorization",
        icon: <FileText className="w-5 h-5" />,
        description: "Required documents",
        badge: user?.email ? "Completed" : "Pending",
        active: tab === "authorization",
      },
      {
        name: "Security Settings",
        href: "security",
        icon: <Shield className="w-5 h-5" />,
        description: "Password & authentication",
        active: tab === "security",
      },
      {
        name: "Subscription & Plan",
        href: "/subscription",
        icon: <CreditCard className="w-5 h-5" />,
        description: "Billing and subscription",
        active: tab === "subscription",
      },
    ],
    [tab, user],
  );

  // User initials for avatar
  const userInitials = useMemo(() => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  }, [user, session]);

  const userName = useMemo(() => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return session?.user?.email || "User";
  }, [user, session]);

  const userEmail = user?.email || session?.user?.email || "";

  // Profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const fields = [
      user.first_name,
      user.last_name,
      user.email,
      user.phone_number,
      user.address_line_1,
      user.city,
      user.postal_code,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error?.name || "Error", {
        description: error?.message || "Failed to load user data",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* User Profile Section */}
      <div className="p-6 bg-gradient-to-br from-[#1742B1] to-[#1742B1]/90 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <span className="text-xl font-semibold text-white">
                {userInitials}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate text-white">
                {userName}
              </h2>
              <p className="text-sm text-white/80 truncate">{userEmail}</p>
            </div>

            {/* Premium Badge - Using Orange Accent */}
            {user?.subscription_status === "active" && (
              <div className="flex items-center gap-1 px-2 py-1 bg-[#FF9900] rounded-full">
                <Star className="w-3 h-3 text-white fill-white" />
                <span className="text-xs font-medium text-white">PRO</span>
              </div>
            )}
          </div>

          {/* Profile Completion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Profile Completion</span>
              <span className="font-medium text-white">
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            {profileCompletion < 100 && (
              <p className="text-xs text-white/70 mt-1">
                Complete your profile for full access
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 bg-[#F5F7FA]">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "group relative flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-white",
                  item.active && "bg-white shadow-sm",
                )}
              >
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#1742B1] rounded-r-full" />
                )}

                {/* Icon Container */}
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                    item.active
                      ? "bg-[#1742B1] text-white shadow-md"
                      : "bg-white text-[#333333] group-hover:bg-[#1742B1] group-hover:text-white",
                  )}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        item.active ? "text-[#111111]" : "text-[#333333]",
                      )}
                    >
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          item.badge === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#FF9900]/10 text-[#FF9900]",
                        )}
                      >
                        {item.badge === "Completed" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {item.badge === "Pending" && (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <ChevronRight
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-all duration-200",
                    item.active
                      ? "text-[#1742B1] translate-x-1"
                      : "text-gray-400 group-hover:translate-x-1 group-hover:text-[#1742B1]",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Link */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <a
          href="settings"
          className="flex items-center gap-3 px-3 py-2 text-sm text-[#333333] hover:text-[#1742B1] hover:bg-[#F5F7FA] rounded-lg transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
