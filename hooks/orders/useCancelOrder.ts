"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SuccessResponse } from "@/types/order";

interface CancelOrderPayload {
  orderId: string;
  reason: string;
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, CancelOrderPayload>({
    mutationFn: async ({ orderId, reason }) => {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order");
      }

      return data;
    },
    onSuccess: (_, { orderId }) => {
      // Invalidate both the specific order and orders list
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
