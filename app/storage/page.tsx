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
import OrderWizard from "@/components/orders/OrderWizard";
import { OrderStatus } from "@/types/order";
import { Package } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const activeOrders =
    ordersData?.orders.filter(
      (order) => order.status !== OrderStatus.COMPLETED,
    ) || [];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <DashboardNavbar />
      {!isUserValid(user) && <VerificationAlert />}

      <Container>
        <Header
          boxes={activeOrders.length}
          setTimeFilter={() => {}}
          setNameFilter={() => {}}
        />
      </Container>

      <Container>
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center border border-[#DADCE0]">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#333333]" />
            </div>
            <p className="text-gray-500 mb-6">No active orders found</p>
            <OrderWizard />
          </div>
        )}
      </Container>
    </div>
  );
}
