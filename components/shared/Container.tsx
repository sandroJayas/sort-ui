import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl ">{children}</div>
  );
};

export default Container;
