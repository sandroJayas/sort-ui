"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckoutVerificationResponse } from "@/types/subscription";

export function useVerifyCheckout(sessionId: string | null) {
  return useQuery<CheckoutVerificationResponse>({
    queryKey: ["subscription", "verify", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");

      const res = await fetch(
        `/api/subscriptions/verify?session_id=${sessionId}`,
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to verify checkout session");
      }

      return res.json();
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60, // 1 min cache
    retry: 3, // Retry more times as subscription might be processing
    retryDelay: 2000, // Wait 2 seconds between retries
  });
}
