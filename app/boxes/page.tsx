"use client";

import { DashboardNavbar } from "@/components/boxes/Navbar";
import BoxCard from "@/components/boxes/BoxCard";
import Header from "@/components/boxes/Header";
import { useUserBoxes } from "@/hooks/useUserBoxes";
import React, { useEffect } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { VerificationAlert } from "@/components/boxes/VerificationAlert";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";

export default function BoxesPage() {
  const { data: boxes, isLoading, error } = useUserBoxes();
  const { data: user } = useUser();

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
      {isUserValid(user) ? null : <VerificationAlert />}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        {boxes ? boxes.map((box) => <BoxCard key={box.id} box={box} />) : null}
      </div>
    </>
  );
}
