"use client";

import { useQuery } from "@tanstack/react-query";
import { BoxesListResponse, BoxFilterRequest } from "@/types/box";

export function useBoxes(filters?: BoxFilterRequest) {
  // Build query params
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.location_id) params.append("location_id", filters.location_id);
  if (filters?.stored_only !== undefined) {
    params.append("stored_only", filters.stored_only.toString());
  }

  return useQuery<BoxesListResponse>({
    queryKey: ["boxes", filters],
    queryFn: async () => {
      const url = params.toString() ? `/api/boxes?${params}` : "/api/boxes";
      const res = await fetch(url);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch boxes");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
