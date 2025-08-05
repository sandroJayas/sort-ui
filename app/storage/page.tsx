// app/storage/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { Package, AlertCircle, Search, Archive } from "lucide-react";
import { DashboardNavbar } from "@/components/shared/Navbar";
import Header from "@/components/orders/Header";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { VerificationAlert } from "@/components/shared/VerificationAlert";
import Container from "@/components/shared/Container";
import OrderCard from "@/components/orders/OrderCard";
import BoxCard from "@/components/boxes/BoxCard";
import OrderWizard from "@/components/orders/OrderWizard";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";
import { useOrders } from "@/hooks/order/useOrders";
import { OrderStatus } from "@/types/order";
import type { OrderListResponse } from "@/components/orders/OrderCard";
import { BoxListResponse, BoxStatus } from "@/types/box";
import { useBoxes } from "@/hooks/box/useBoxes";

interface EmptyStateProps {
  hasFilter?: boolean;
  type?: "orders" | "boxes";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilter = false,
  type = "orders",
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      {hasFilter ? (
        <Search className="w-10 h-10 text-gray-400" />
      ) : type === "boxes" ? (
        <Archive className="w-10 h-10 text-gray-400" />
      ) : (
        <Package className="w-10 h-10 text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasFilter
        ? `No ${type} found`
        : type === "boxes"
          ? "No stored boxes"
          : "No active orders"}
    </h3>
    <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
      {hasFilter
        ? "Try adjusting your filters or search terms to find what you're looking for."
        : type === "boxes"
          ? "Your stored boxes will appear here once they've been processed and stored in our warehouse."
          : "Get started by creating your first storage order. It only takes a few minutes!"}
    </p>
    {!hasFilter && type === "orders" && <OrderWizard />}
  </div>
);

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  type?: "orders" | "boxes";
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  type = "orders",
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
      {error.message || `We couldn't load your ${type}. Please try again.`}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1742B1] text-white rounded-lg font-medium text-sm hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20"
      >
        Try Again
      </button>
    )}
  </div>
);

const LoadingState: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center py-16">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export default function StoragePage() {
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders();
  const {
    data: boxesData,
    isLoading: boxesLoading,
    error: boxesError,
    refetch: refetchBoxes,
  } = useBoxes();
  const { data: user } = useUser();
  const [timeFilter, setTimeFilter] = useState("3months");
  const [nameFilter, setNameFilter] = useState<string | null>(null);

  // Show error toast on error
  useEffect(() => {
    if (ordersError) {
      toast.error(ordersError?.name || "Error", {
        description: ordersError?.message || "Failed to load orders",
      });
    }
    if (boxesError) {
      toast.error(boxesError?.name || "Error", {
        description: boxesError?.message || "Failed to load boxes",
      });
    }
  }, [ordersError, boxesError]);

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
        const endOf2025 = new Date(2025, 11, 31, 23, 59, 59);
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= filterDate && orderDate <= endOf2025;
        });
        return filtered;
      case "2024":
        filterDate.setFullYear(2024, 0, 1);
        const endOf2024 = new Date(2024, 11, 31, 23, 59, 59);
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= filterDate && orderDate <= endOf2024;
        });
        return filtered;
    }

    if (timeFilter === "30days" || timeFilter === "3months") {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= filterDate,
      );
    }

    return filtered;
  }, [ordersData?.orders, nameFilter, timeFilter]);

  const handleRetryOrders = useCallback(() => {
    refetchOrders();
  }, [refetchOrders]);

  const handleRetryBoxes = useCallback(() => {
    refetchBoxes();
  }, [refetchBoxes]);

  const isVerified = isUserValid(user);
  const hasActiveFilter = !!nameFilter || timeFilter !== "3months";

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1742B1] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <DashboardNavbar />

      {!isVerified && user ? <VerificationAlert /> : null}

      <main id="main-content" role="main">
        <Container>
          <Header setTimeFilter={setTimeFilter} setNameFilter={setNameFilter} />
        </Container>

        <Container className="py-0 space-y-6">
          {/* Active Orders Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Orders Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Active Orders
                </h2>
                {activeOrders.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {activeOrders.length}{" "}
                    {activeOrders.length === 1 ? "order" : "orders"}
                  </span>
                )}
              </div>
            </div>

            {/* Orders Content */}
            <div className="p-6">
              {ordersLoading ? (
                <LoadingState text="Loading your orders..." />
              ) : ordersError ? (
                <ErrorState
                  error={ordersError}
                  onRetry={handleRetryOrders}
                  type="orders"
                />
              ) : activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <EmptyState hasFilter={hasActiveFilter} type="orders" />
              )}
            </div>
          </div>
          {/* Stored Boxes Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Boxes Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-gray-500" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Stored Boxes
                  </h2>
                </div>
                {boxesData?.boxes && boxesData.boxes.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {
                      boxesData.boxes.filter(
                        (box) => box.status === BoxStatus.STORED,
                      ).length
                    }{" "}
                    {boxesData.boxes.filter(
                      (box) => box.status === BoxStatus.STORED,
                    ).length === 1
                      ? "box"
                      : "boxes"}{" "}
                    in storage
                  </span>
                )}
              </div>
            </div>

            {/* Boxes Content */}
            <div className="p-6">
              {boxesLoading ? (
                <LoadingState text="Loading your stored boxes..." />
              ) : boxesError ? (
                <ErrorState
                  error={boxesError}
                  onRetry={handleRetryBoxes}
                  type="boxes"
                />
              ) : boxesData?.boxes &&
                boxesData.boxes.filter(
                  (box) =>
                    box.status === BoxStatus.STORED ||
                    box.status === BoxStatus.IN_TRANSIT ||
                    box.status === BoxStatus.RETURNED,
                ).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boxesData.boxes
                    .filter(
                      (box) =>
                        box.status === BoxStatus.STORED ||
                        box.status === BoxStatus.IN_TRANSIT ||
                        box.status === BoxStatus.RETURNED,
                    )
                    .map((box: BoxListResponse) => (
                      <BoxCard key={box.id} box={box} />
                    ))}
                </div>
              ) : (
                <EmptyState type="boxes" />
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
