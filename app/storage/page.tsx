"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { DashboardNavbar } from "@/components/shared/Navbar";
import Header from "@/components/orders/Header";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { VerificationAlert } from "@/components/shared/VerificationAlert";
import Container from "@/components/shared/Container";
import OrderCard from "@/components/orders/OrderCard";
import OrderWizard from "@/components/orders/OrderWizard";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";
import { useOrders } from "@/hooks/order/useOrders";
import { OrderStatus } from "@/types/order";
import type { OrderListResponse } from "@/components/orders/OrderCard";

interface EmptyStateProps {
  onCreateOrder?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateOrder }) => (
  <div className="bg-white rounded-lg p-12 text-center border border-[#DADCE0]">
    <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="w-8 h-8 text-[#333333]" aria-hidden="true" />
    </div>
    <h2 className="text-lg font-medium text-gray-700 mb-2">No active orders</h2>
    <p className="text-gray-500 mb-6">Create your first order to get started</p>
    <OrderWizard />
  </div>
);

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="bg-white rounded-lg p-12 text-center border border-red-200">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="w-8 h-8 text-red-600" aria-hidden="true" />
    </div>
    <h2 className="text-lg font-medium text-gray-700 mb-2">
      Error loading orders
    </h2>
    <p className="text-gray-500 mb-6">
      {error.message || "Something went wrong"}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-[#1742B1] text-white px-6 py-2.5 rounded-md font-semibold text-sm uppercase tracking-wider hover:bg-[#14399F] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1742B1] focus:ring-offset-2"
      >
        Try Again
      </button>
    )}
  </div>
);

export default function BoxesPage() {
  const { data: ordersData, isLoading, error, refetch } = useOrders();
  const { data: user } = useUser();
  const [timeFilter, setTimeFilter] = useState("3months");
  const [nameFilter, setNameFilter] = useState<string | null>(null);

  // Show error toast on error
  useEffect(() => {
    if (error) {
      toast.error(error?.name || "Error", {
        description: error?.message || "Failed to load orders",
      });
    }
  }, [error]);

  // Filter active orders
  const activeOrders = useMemo(() => {
    if (!ordersData?.orders) return [];

    let filtered = ordersData.orders.filter(
      (order: OrderListResponse) => order.status !== OrderStatus.COMPLETED,
    );

    // Apply name filter
    if (nameFilter) {
      const searchTerm = nameFilter.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm) ||
          order.order_type.toLowerCase().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm),
      );
    }

    // Apply time filter
    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case "30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "2025":
        filterDate.setFullYear(2025, 0, 1);
        break;
      case "2024":
        filterDate.setFullYear(2024, 0, 1);
        break;
    }

    filtered = filtered.filter(
      (order) => new Date(order.created_at) >= filterDate,
    );

    return filtered;
  }, [ordersData?.orders, nameFilter, timeFilter]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const isVerified = isUserValid(user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <DashboardNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1742B1] text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      <DashboardNavbar />

      {!isVerified && <VerificationAlert />}

      <main id="main-content" role="main">
        <Container>
          <Header
            boxes={activeOrders.length}
            setTimeFilter={setTimeFilter}
            setNameFilter={setNameFilter}
          />
        </Container>

        <Container>
          <section aria-label="Orders list">
            {error ? (
              <ErrorState error={error} onRetry={handleRetry} />
            ) : activeOrders.length > 0 ? (
              <div className="space-y-4" role="list">
                {activeOrders.map((order) => (
                  <div key={order.id} role="listitem">
                    <OrderCard order={order} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
