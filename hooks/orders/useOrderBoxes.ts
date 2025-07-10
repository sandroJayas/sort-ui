"use client";

import { useQuery } from "@tanstack/react-query";
import { BoxListResponse } from "@/types/order";

interface OrderBoxesResponse {
  boxes: BoxListResponse[];
}

export function useOrderBoxes(orderId: string | null | undefined) {
  return useQuery<OrderBoxesResponse>({
    queryKey: ["order-boxes", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");

      const res = await fetch(`/api/orders/${orderId}/boxes`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch order boxes");
      }

      return res.json();
    },
    enabled: !!orderId, // Only run query if orderId is provided
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
