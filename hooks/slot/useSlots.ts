"use client";

import { useQuery } from "@tanstack/react-query";
import { AllSlotsRequest, SlotAvailabilityResponse } from "@/types/slot";

export function useSlots(
  request: AllSlotsRequest | null,
  enabled: boolean = true,
) {
  return useQuery<SlotAvailabilityResponse>({
    queryKey: ["all-slots", request],
    queryFn: async () => {
      if (!request) {
        throw new Error("Request is required");
      }

      const res = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch slots");
      }

      return res.json();
    },
    enabled: enabled && !!request, // Only run when enabled AND request exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });
}
