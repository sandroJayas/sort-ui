import React, { JSX, memo } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

const SIZES = {
  sm: "max-w-4xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
} as const;

const Container: React.FC<ContainerProps> = memo(
  ({
    children,
    className = "",
    as: Component = "div",
    size = "xl",
    noPadding = false,
  }) => {
    const sizeClass = SIZES[size];
    const paddingClass = noPadding ? "" : "px-4 sm:px-6 lg:px-8 py-6 sm:py-8";

    return (
      <Component
        className={`${sizeClass} mx-auto ${paddingClass} ${className}`.trim()}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";

export default Container;
