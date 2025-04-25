"use client";

import { DashboardNavbar } from "@/components/dashboard/Navbar";
import BoxCard from "@/components/dashboard/BoxCard";
import Header from "@/components/dashboard/Header";
import { useUserBoxes } from "@/hooks/useUserBoxes";
import React, { useEffect } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { data: boxes, isLoading, error } = useUserBoxes();

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
    <>
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Header />
        {boxes ? boxes.map((box) => <BoxCard key={box.id} box={box} />) : null}
      </div>
    </>
  );
}
