"use client";

import { memo } from "react";
import { signIn } from "next-auth/react";

export const NavigationBar = memo(function NavigationBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 w-full z-50 mix-blend-difference"
    >
      <div className="flex justify-between items-center p-6 sm:p-8 md:p-12">
        <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
          SORT
        </div>
        <button
          className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-[#F8B24E] bg-[#F8B24E] text-[#0F1A7D] font-black hover:bg-transparent hover:text-[#F8B24E] transition-all duration-300 text-sm sm:text-base uppercase tracking-wider"
          onClick={() => signIn("auth0", { callbackUrl: "/storage" })}
        >
          Enter
        </button>
      </div>
    </nav>
  );
});
