"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderFilterRequest, OrderListResponse } from "@/types/order";

interface OrdersResponse {
  orders: OrderListResponse[];
  total: number;
}

export function useOrders(filters?: OrderFilterRequest) {
  // Build query params
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.order_type) params.append("order_type", filters.order_type);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("page_size", filters.limit.toString());

  return useQuery<OrdersResponse>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const url = params.toString() ? `/api/orders?${params}` : "/api/orders";
      const res = await fetch(url);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch orders");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
