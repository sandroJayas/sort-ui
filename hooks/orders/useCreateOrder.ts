"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest, OrderResponse } from "@/types/order";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, CreateOrderRequest>({
    mutationFn: async (orderData) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate orders list to refetch with new order
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
