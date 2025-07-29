"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function VerificationAlert() {
  return (
    <div className="bg-[#FFF3E0] border-l-4 border-[#FF9900]">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 text-[#FF9900] mt-0.5 flex-shrink-0"
              strokeWidth={2}
            />
            <p className="text-[#333333] text-base leading-relaxed">
              To access Sort&#39;s full features, please complete your profile
              details first.
            </p>
          </div>
          <Link
            href="/profile/personal-information"
            className="bg-[#FF9900] text-white px-6 py-2.5 rounded-md font-semibold text-sm uppercase tracking-wider hover:bg-[#E68900] transition-all duration-200 w-full md:w-auto text-center inline-block"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
