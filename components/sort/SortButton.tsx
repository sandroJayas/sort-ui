// components/sort/SortButton.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SortButtonProps
  extends Omit<React.ComponentProps<"button">, "variant"> {
  /**
   * Button variant following Sort's design system
   * - primary: Royal blue (#1742B1) - Main actions and brand elements
   * - secondary: Teal blue (#178FB1) - Secondary actions
   * - cta: Bright orange (#FF9900) - Call-to-action buttons
   * - ghost: Transparent with hover effects
   * - outline: Border-only style
   * - success: Green for confirmations
   * - destructive: Red for dangerous actions
   */
  variant?:
    | "primary"
    | "secondary"
    | "cta"
    | "ghost"
    | "outline"
    | "success"
    | "destructive";
  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean;
  /**
   * Button size variants
   */
  size?: "sm" | "md" | "lg" | "icon";
  /**
   * Render as a child component
   */
  asChild?: boolean;
}

const sortButtonVariants = {
  primary: cn(
    // Base - clean, flat design
    "bg-[#1742B1] text-white",
    // Hover - subtle brightness adjustment
    "hover:bg-[#1A4AC2] active:bg-[#143799]",
    // Clean shadow for depth
    "shadow-sm hover:shadow-md active:shadow-sm",
    // Focus state for accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1] focus-visible:ring-offset-2",
    // Smooth, quick transition
    "transition-all duration-200 ease-out",
  ),
  secondary: cn(
    // Base
    "bg-[#178FB1] text-white",
    // Hover
    "hover:bg-[#1A9AC3] active:bg-[#147DA0]",
    // Shadow
    "shadow-sm hover:shadow-md active:shadow-sm",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#178FB1] focus-visible:ring-offset-2",
    // Transition
    "transition-all duration-200 ease-out",
  ),
  cta: cn(
    // Base - slightly bolder for CTAs
    "bg-[#FF9900] text-white font-semibold",
    // Hover with subtle scale
    "hover:bg-[#FFA520] hover:scale-[1.02] active:bg-[#E88800] active:scale-[0.98]",
    // Stronger shadow for prominence
    "shadow-md hover:shadow-lg active:shadow-md",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2",
    // Transition
    "transition-all duration-200 ease-out",
  ),
  ghost: cn(
    // Base - minimal style
    "bg-transparent text-[#212121]",
    // Hover - subtle background
    "hover:bg-[#F8F9FA] hover:text-[#1742B1] active:bg-[#E9ECEF]",
    // No shadow
    "shadow-none",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/20 focus-visible:ring-offset-2",
    // Transition
    "transition-colors duration-200 ease-out",
  ),
  outline: cn(
    // Base - clean border
    "bg-transparent text-[#1742B1] border-[#1742B1]/25",
    // Hover - fill effect
    "hover:bg-[#1742B1]/5 hover:border-[#1742B1]/40 active:bg-[#1742B1]/10",
    // Border
    "border",
    // No shadow by default
    "shadow-none",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1742B1]/50 focus-visible:ring-offset-2",
    // Transition
    "transition-all duration-200 ease-out",
  ),
  success: cn(
    // Base
    "bg-[#198754] text-white",
    // Hover
    "hover:bg-[#1A9560] active:bg-[#157347]",
    // Shadow
    "shadow-sm hover:shadow-md active:shadow-sm",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#198754] focus-visible:ring-offset-2",
    // Transition
    "transition-all duration-200 ease-out",
  ),
  destructive: cn(
    // Base
    "bg-[#DC3545] text-white",
    // Hover
    "hover:bg-[#E04656] active:bg-[#C82333]",
    // Shadow
    "shadow-sm hover:shadow-md active:shadow-sm",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC3545] focus-visible:ring-offset-2",
    // Transition
    "transition-all duration-200 ease-out",
  ),
};

const sortButtonSizes = {
  sm: cn("h-9 px-3.5 gap-1.5", "text-sm font-medium", "rounded-lg"),
  md: cn("h-10 px-5 gap-2", "text-sm font-medium", "rounded-lg"),
  lg: cn("h-12 px-6 gap-2", "text-base font-medium", "rounded-xl"),
  icon: cn("h-10 w-10", "rounded-lg", "p-0"),
};

export function SortButton({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  asChild = false,
  ...props
}: SortButtonProps) {
  return (
    <Button
      className={cn(
        // Base styles for all Sort buttons
        "relative inline-flex items-center justify-center",
        "font-medium whitespace-nowrap select-none",
        "antialiased",

        // Clean disabled state
        "disabled:pointer-events-none disabled:opacity-50",

        // Loading state
        loading && "cursor-wait",

        // Icon sizing - clean and proportional
        "[&_svg]:shrink-0",
        size === "sm" && "[&_svg]:h-4 [&_svg]:w-4",
        size === "md" && "[&_svg]:h-4 [&_svg]:w-4",
        size === "lg" && "[&_svg]:h-5 [&_svg]:w-5",
        size === "icon" && "[&_svg]:h-5 [&_svg]:w-5",

        // Apply variant styles
        sortButtonVariants[variant],

        // Apply size styles
        sortButtonSizes[size],

        // User-provided classes
        className,
      )}
      disabled={disabled || loading}
      asChild={asChild}
      {...props}
    >
      {/* Clean loading implementation */}
      {loading && (
        <Loader2 className={cn("animate-spin", children && "mr-2")} />
      )}
      {children}
    </Button>
  );
}

// Export convenience components for common use cases
export function SortCTAButton(props: Omit<SortButtonProps, "variant">) {
  return <SortButton variant="cta" {...props} />;
}

export function SortPrimaryButton(props: Omit<SortButtonProps, "variant">) {
  return <SortButton variant="primary" {...props} />;
}

export function SortSecondaryButton(props: Omit<SortButtonProps, "variant">) {
  return <SortButton variant="secondary" {...props} />;
}
