"use client";

import { DashboardNavbar } from "@/components/boxes/Navbar";
import BoxCard from "@/components/boxes/BoxCard";
import Header from "@/components/boxes/Header";
import { useUserBoxes } from "@/hooks/useUserBoxes";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { VerificationAlert } from "@/components/boxes/VerificationAlert";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";
import Container from "@/components/shared/Container";
import { Box } from "@/types/box";

export default function BoxesPage() {
  const { data: boxes, isLoading, error } = useUserBoxes();
  const [timeFilter, setTimeFilter] = useState<string>("30days");
  const [nameFilter, setNameFilter] = useState<string | null>(null);
  const [filteredBoxes, setFilteredBoxes] = useState<Box[] | undefined>([]);
  const { data: user } = useUser();

  useEffect(() => {
    let filteredBoxes = boxes?.filter((box: Box) => {
      //TODO time filter
      console.log(box);
      return true;
    });

    filteredBoxes = nameFilter
      ? filteredBoxes?.filter((box: Box) => {
          return (
            box.items[0].name
              .toLowerCase()
              .includes(nameFilter.toLowerCase()) ||
            box.items[0].description
              .toLowerCase()
              .includes(nameFilter.toLowerCase())
          );
        })
      : filteredBoxes;

    setFilteredBoxes(filteredBoxes);
  }, [boxes, nameFilter, timeFilter]);

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
      <Container>
        <Header
          boxes={filteredBoxes?.length ?? 0}
          setTimeFilter={setTimeFilter}
          setNameFilter={setNameFilter}
        />
        {filteredBoxes
          ? filteredBoxes.map((box) => <BoxCard key={box.id} box={box} />)
          : null}
      </Container>
    </>
  );
}
