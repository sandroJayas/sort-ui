import React, { memo } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "default" | "minimal";
}

const SIZES = {
  sm: {
    wrapper: "w-8 h-8",
    dots: "w-1.5 h-1.5",
    textSize: "text-xs",
  },
  md: {
    wrapper: "w-12 h-12",
    dots: "w-2 h-2",
    textSize: "text-sm",
  },
  lg: {
    wrapper: "w-16 h-16",
    dots: "w-2.5 h-2.5",
    textSize: "text-base",
  },
} as const;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(
  ({
    size = "md",
    text = "Loading...",
    className = "",
    variant = "default",
  }) => {
    const sizeClasses = SIZES[size];

    if (variant === "minimal") {
      return (
        <div
          className={`flex items-center justify-center ${className}`.trim()}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={`relative ${sizeClasses.wrapper}`}>
            <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-2 border-[#1742B1] border-t-transparent animate-spin" />
          </div>
          <span className="sr-only">{text}</span>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="relative">
          {/* Animated dots */}
          <div className={`${sizeClasses.wrapper} relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`${sizeClasses.dots} bg-[#1742B1] rounded-full animate-pulse`}
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      animationDuration: "1.4s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className={`${sizeClasses.textSize} text-gray-600 font-medium`}>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{text}</span>
        </p>
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
