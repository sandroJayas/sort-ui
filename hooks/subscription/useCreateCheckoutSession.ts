"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
} from "@/types/subscription";

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation<
    CheckoutSessionResponse,
    Error,
    CreateCheckoutSessionRequest
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Failed to create checkout session",
        );
      }

      return responseData;
    },
    onSuccess: () => {
      // Invalidate subscription queries after successful checkout
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
