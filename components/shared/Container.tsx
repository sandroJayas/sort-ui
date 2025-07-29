import React, { JSX, memo } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const Container: React.FC<ContainerProps> = memo(
  ({ children, className = "", as: Component = "div" }) => {
    return (
      <Component
        className={`max-w-[1200px] mx-auto px-4 py-8 ${className}`.trim()}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";

export default Container;
