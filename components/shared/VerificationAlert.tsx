"use client";

import React, { memo, useState } from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export const VerificationAlert: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-orange-100"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle
                  className="w-4 h-4 text-orange-600"
                  strokeWidth={2}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p className="text-sm font-medium text-gray-900">
                Complete your profile to unlock all features
              </p>
              <Link
                href="/profile/personal-information"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors group"
              >
                Update profile
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-md transition-all duration-200"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

VerificationAlert.displayName = "VerificationAlert";
