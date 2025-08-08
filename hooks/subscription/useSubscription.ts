"use client";

import { useQuery } from "@tanstack/react-query";
import { UserSubscriptionResponse } from "@/types/subscription";

export function useSubscription() {
  return useQuery<UserSubscriptionResponse>({
    queryKey: ["subscription", "current"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/current");

      if (res.status === 404) {
        // No subscription found is a valid state
        return null;
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch subscription");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
