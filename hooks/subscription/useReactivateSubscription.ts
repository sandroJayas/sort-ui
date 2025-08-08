"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SuccessResponse } from "@/types/subscription";

export function useReactivateSubscription() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/subscriptions/reactivate", {
        method: "POST",
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Failed to reactivate subscription",
        );
      }

      return responseData;
    },
    onSuccess: () => {
      // Invalidate subscription queries after reactivation
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}
