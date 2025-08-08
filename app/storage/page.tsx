// app/storage/page.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
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

// ============= Constants =============
const TIME_FILTERS = {
  "30days": { label: "Last 30 days", days: 30 },
  "3months": { label: "Last 3 months", months: 3 },
  "2025": { label: "2025", year: 2025 },
  "2024": { label: "2024", year: 2024 },
} as const;

type TimeFilterKey = keyof typeof TIME_FILTERS;

const ACTIVE_ORDER_STATUSES = new Set([
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.IN_FULFILLMENT,
]);

const VISIBLE_BOX_STATUSES = new Set([
  BoxStatus.STORED,
  BoxStatus.IN_TRANSIT,
  BoxStatus.RETURNED,
]);

// ============= Helper Functions =============
const filterByDateRange = (
  items: Array<{ created_at: string }>,
  startDate: Date,
  endDate?: Date,
): Array<{ created_at: string }> => {
  return items.filter((item) => {
    const itemDate = new Date(item.created_at);
    if (isNaN(itemDate.getTime())) return false;

    const afterStart = itemDate >= startDate;
    const beforeEnd = endDate ? itemDate <= endDate : true;

    return afterStart && beforeEnd;
  });
};

const getDateRangeForFilter = (
  filterKey: TimeFilterKey,
): { start: Date; end?: Date } => {
  const now = new Date();
  const filter = TIME_FILTERS[filterKey];

  if ("days" in filter) {
    const start = new Date();
    start.setDate(now.getDate() - filter.days);
    start.setHours(0, 0, 0, 0);
    return { start };
  }

  if ("months" in filter) {
    const start = new Date();
    start.setMonth(now.getMonth() - filter.months);
    start.setHours(0, 0, 0, 0);
    return { start };
  }

  if ("year" in filter) {
    const start = new Date(filter.year, 0, 1, 0, 0, 0, 0);
    const end = new Date(filter.year, 11, 31, 23, 59, 59, 999);
    return { start, end };
  }

  return { start: now };
};

const searchInOrder = (
  order: OrderListResponse,
  searchTerm: string,
): boolean => {
  const term = searchTerm.toLowerCase();
  return (
    order.id.toLowerCase().includes(term) ||
    order.order_type.toLowerCase().includes(term) ||
    order.status.toLowerCase().includes(term)
  );
};

// ============= Sub-components =============
interface EmptyStateProps {
  hasFilter?: boolean;
  type?: "orders" | "boxes";
  onCreateOrder?: () => void;
}

const EmptyState = React.memo<EmptyStateProps>(
  ({ hasFilter = false, type = "orders", onCreateOrder }) => (
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
      {!hasFilter && type === "orders" && onCreateOrder && <OrderWizard />}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  type?: "orders" | "boxes";
}

const ErrorState = React.memo<ErrorStateProps>(
  ({ error, onRetry, type = "orders" }) => (
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
          aria-label={`Retry loading ${type}`}
        >
          Try Again
        </button>
      )}
    </div>
  ),
);

ErrorState.displayName = "ErrorState";

const LoadingState = React.memo<{ text?: string }>(
  ({ text = "Loading..." }) => (
    <div className="flex items-center justify-center py-16">
      <LoadingSpinner size="lg" text={text} />
    </div>
  ),
);

LoadingState.displayName = "LoadingState";

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  count?: string;
  children: React.ReactNode;
}

const Section = React.memo<SectionProps>(({ title, icon, count, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        {count && <span className="text-sm text-gray-500">{count}</span>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
));

Section.displayName = "Section";

// ============= Main Component =============
export default function StoragePage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterKey>("3months");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [isPageVisible, setIsPageVisible] = useState(true);
  const errorShownRef = useRef<Set<string>>(new Set());

  // User data
  const { data: user, isLoading: isUserLoading, error: userError } = useUser();

  const isVerified = useMemo(() => isUserValid(user), [user]);

  // Only fetch data when page is visible and user is verified
  const shouldFetchData = isPageVisible && isVerified && !isUserLoading;

  // Orders data with conditional fetching
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders();

  // Boxes data with conditional fetching
  const {
    data: boxesData,
    isLoading: boxesLoading,
    error: boxesError,
    refetch: refetchBoxes,
  } = useBoxes({
    filters: { stored_only: false }, // Get all boxes, we'll filter in UI
    enabled: shouldFetchData,
  });

  // Page visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Error handling with deduplication
  useEffect(() => {
    const showErrorToast = (error: Error | null, type: string) => {
      if (!error) return;

      const errorKey = `${type}-${error.message}`;
      if (errorShownRef.current.has(errorKey)) return;

      errorShownRef.current.add(errorKey);
      toast.error(error.name || "Error", {
        description: error.message || `Failed to load ${type}`,
      });

      // Clear error from set after 5 seconds
      setTimeout(() => {
        errorShownRef.current.delete(errorKey);
      }, 5000);
    };

    showErrorToast(ordersError, "orders");
    showErrorToast(boxesError, "boxes");
    showErrorToast(userError, "user");
  }, [ordersError, boxesError, userError]);

  // Memoized filtered active orders
  const activeOrders = useMemo(() => {
    if (!ordersData?.orders) return [];

    // Filter for active orders only
    let filtered = ordersData.orders.filter((order: OrderListResponse) =>
      ACTIVE_ORDER_STATUSES.has(order.status as OrderStatus),
    );

    // Apply search filter
    if (nameFilter.trim()) {
      filtered = filtered.filter((order) =>
        searchInOrder(order, nameFilter.trim()),
      );
    }

    // Apply time filter
    const { start, end } = getDateRangeForFilter(timeFilter);
    filtered = filterByDateRange(filtered, start, end) as OrderListResponse[];

    return filtered;
  }, [ordersData?.orders, nameFilter, timeFilter]);

  // Memoized filtered stored boxes
  const visibleBoxes = useMemo(() => {
    if (!boxesData?.boxes) return [];

    return boxesData.boxes.filter((box: BoxListResponse) =>
      VISIBLE_BOX_STATUSES.has(box.status as BoxStatus),
    );
  }, [boxesData?.boxes]);

  // Memoized count strings
  const ordersCountString = useMemo(() => {
    if (!activeOrders.length) return undefined;
    return `${activeOrders.length} ${activeOrders.length === 1 ? "order" : "orders"}`;
  }, [activeOrders.length]);

  const boxesCountString = useMemo(() => {
    const storedCount = visibleBoxes.filter(
      (box) => box.status === BoxStatus.STORED,
    ).length;

    if (!storedCount) return undefined;
    return `${storedCount} ${storedCount === 1 ? "box" : "boxes"} in storage`;
  }, [visibleBoxes]);

  // Handlers
  const handleRetryOrders = useCallback(() => {
    errorShownRef.current.clear();
    refetchOrders();
  }, [refetchOrders]);

  const handleRetryBoxes = useCallback(() => {
    errorShownRef.current.clear();
    refetchBoxes();
  }, [refetchBoxes]);

  const handleTimeFilterChange = useCallback((value: string) => {
    if (value in TIME_FILTERS) {
      setTimeFilter(value as TimeFilterKey);
    }
  }, []);

  const handleNameFilterChange = useCallback((value: string | null) => {
    setNameFilter(value || "");
  }, []);

  const handleCreateOrder = useCallback(() => {
    // This could trigger a modal or navigation
    console.log("Create order triggered");
  }, []);

  // Check if filters are active
  const hasActiveFilter = nameFilter.trim() !== "" || timeFilter !== "3months";

  // Combined loading state
  const isInitialLoading =
    isUserLoading || (shouldFetchData && ordersLoading && boxesLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1742B1] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <DashboardNavbar />

      {/* Verification Alert */}
      {!isVerified && !isUserLoading && <VerificationAlert />}

      <main id="main-content" role="main" aria-label="Storage Dashboard">
        <Container>
          <Header
            setTimeFilter={handleTimeFilterChange}
            setNameFilter={handleNameFilterChange}
          />
        </Container>

        <Container className="py-0 space-y-6">
          {isInitialLoading ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
              <LoadingState text="Loading your storage dashboard..." />
            </div>
          ) : (
            <>
              {/* Active Orders Section */}
              <Section title="Active Orders" count={ordersCountString}>
                {ordersLoading && !ordersData ? (
                  <LoadingState text="Loading your orders..." />
                ) : ordersError ? (
                  <ErrorState
                    error={ordersError}
                    onRetry={handleRetryOrders}
                    type="orders"
                  />
                ) : activeOrders.length > 0 ? (
                  <div
                    className="space-y-4"
                    role="list"
                    aria-label="Active orders list"
                  >
                    {activeOrders.map((order) => (
                      <div key={order.id} role="listitem">
                        <OrderCard order={order} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    hasFilter={hasActiveFilter}
                    type="orders"
                    onCreateOrder={handleCreateOrder}
                  />
                )}
              </Section>

              {/* Stored Boxes Section */}
              <Section
                title="Stored Boxes"
                icon={<Archive className="w-5 h-5 text-gray-500" />}
                count={boxesCountString}
              >
                {boxesLoading && !boxesData ? (
                  <LoadingState text="Loading your stored boxes..." />
                ) : boxesError ? (
                  <ErrorState
                    error={boxesError}
                    onRetry={handleRetryBoxes}
                    type="boxes"
                  />
                ) : visibleBoxes.length > 0 ? (
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    role="list"
                    aria-label="Stored boxes list"
                  >
                    {visibleBoxes.map((box: BoxListResponse) => (
                      <div key={box.id} role="listitem">
                        <BoxCard box={box} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="boxes" />
                )}
              </Section>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
