"use client";

import { DashboardNavbar } from "@/components/boxes/Navbar";
import Header from "@/components/boxes/Header";
import React, { useEffect } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { VerificationAlert } from "@/components/boxes/VerificationAlert";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";
import Container from "@/components/shared/Container";
import { useOrders } from "@/hooks/order/useOrders";
import OrderCard from "@/components/orders/OrderCard";

export default function BoxesPage() {
  const { data: ordersData, isLoading, error } = useOrders();
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
      <Container>
        <Header boxes={0} setTimeFilter={() => {}} setNameFilter={() => {}} />
      </Container>
      <Container>
        {ordersData?.orders.map((order) => {
          return <OrderCard key={order.id} order={order} />;
        })}
      </Container>
    </>
  );
}
