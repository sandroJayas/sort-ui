"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";

const Sidebar = (props: { tab: string }) => {
  const menuItems = [
    {
      name: "Personal information & address",
      href: "personal-information",
      active: props.tab == "personal-information",
    },
    {
      name: "Authorization form",
      href: "authorization",
      active: props.tab == "authorization",
    },
    {
      name: "Security settings",
      href: "security",
      active: props.tab == "security",
    },
    {
      name: "Subscription & plan",
      href: "subscription",
      active: props.tab == "subscription",
    },
  ];

  const { data: user, isLoading, error } = useUser();
  const { data: session } = useSession();

  useEffect(() => {
    if (error) {
      toast.error(error?.name, {
        description: error?.message,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Card className="rounded-md h-fit">
      <div className="px-6 pb-6 border-b">
        <h2 className="font-semibold">
          {user ? user.first_name + " " + user.last_name : session?.user.email}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
      </div>
      <nav className="py-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "block py-3 px-6 text-sm transition-colors hover:bg-gray-100",
                  item.active &&
                    "border-l-4 border-primary bg-gray-100 font-medium",
                )}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
};

export default Sidebar;
