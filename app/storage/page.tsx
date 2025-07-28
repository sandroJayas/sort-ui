"use client";

import { DashboardNavbar } from "@/components/shared/Navbar";
import Header from "@/components/orders/Header";
import React, { useEffect } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { VerificationAlert } from "@/components/shared/VerificationAlert";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";
import Container from "@/components/shared/Container";
import { useOrders } from "@/hooks/order/useOrders";
import OrderCard from "@/components/orders/OrderCard";
import { OrderStatus } from "@/types/order";

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
          if (order.status === OrderStatus.COMPLETED) {
            return null;
          }
          return <OrderCard key={order.id} order={order} />;
        })}
      </Container>
    </>
  );
}
