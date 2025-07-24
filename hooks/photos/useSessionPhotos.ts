"use client";

import { useQuery } from "@tanstack/react-query";
import { PhotoListResponse } from "@/types/photos";

export function useSessionPhotos(sessionId: string) {
  return useQuery<PhotoListResponse>({
    queryKey: ["session-photos", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/photos/session/${sessionId}`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch session photos");
      }

      return res.json();
    },
    enabled: !!sessionId, // Only run if sessionId exists
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
