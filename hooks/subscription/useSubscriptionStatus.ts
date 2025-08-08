"use client";

import { useQuery } from "@tanstack/react-query";
import { SubscriptionStatusResponse } from "@/types/subscription";

export function useSubscriptionStatus() {
  return useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription", "status"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/status");

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to check subscription status");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
