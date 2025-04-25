"use client";

import { useQuery } from "@tanstack/react-query";
import { Box } from "@/types/box";

export function useUserBoxes() {
  return useQuery<Box[]>({
    queryKey: ["user-boxes"],
    queryFn: async () => {
      const res = await fetch("/api/boxes");

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch boxes");
      }

      const data = await res.json();
      return data.boxes as Box[];
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
}
