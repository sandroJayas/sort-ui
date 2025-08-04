"use client";

import { useQuery } from "@tanstack/react-query";
import { BoxResponse } from "@/types/box";

export function useBox(boxId: string | null | undefined) {
  return useQuery<BoxResponse>({
    queryKey: ["box", boxId],
    queryFn: async () => {
      if (!boxId) throw new Error("Box ID is required");

      const res = await fetch(`/api/boxes/${boxId}`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch box");
      }

      return res.json();
    },
    enabled: !!boxId,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
