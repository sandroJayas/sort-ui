"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
      name: "Change password",
      href: "change-password",
      active: props.tab == "change-password",
    },
    {
      name: "Two-factor authentication",
      href: "#",
      active: props.tab == "",
    },
    {
      name: "Subscription & plan",
      href: "subscription",
      active: props.tab == "subscription",
    },
  ];

  return (
    <Card className="bg-white border rounded-md h-fit w-full md:w-64">
      <div className="px-6 pb-6 border-b">
        <h2 className="font-semibold">Shamal Sandro Jayasinghe</h2>
        <p className="text-sm text-gray-500 mt-1">mail</p>
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
