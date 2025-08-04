"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestBoxReturnRequest, BatchIDResponse } from "@/types/box";

export function useRequestBoxReturn() {
  const queryClient = useQueryClient();

  return useMutation<BatchIDResponse, Error, RequestBoxReturnRequest>({
    mutationFn: async (data) => {
      const res = await fetch("/api/boxes/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to request box return");
      }

      return responseData;
    },
    onSuccess: () => {
      // Invalidate boxes list and operations
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
}
