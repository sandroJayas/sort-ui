"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateBoxRequest, CreateBoxResponse } from "@/types/box";

export function useCreateBox() {
  const queryClient = useQueryClient();

  return useMutation<CreateBoxResponse, Error, CreateBoxRequest>({
    mutationFn: async (boxData) => {
      const res = await fetch("/api/boxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boxData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create box");
      }

      return data;
    },
    onSuccess: () => {
      // Refetch boxes list after creating a new one
      queryClient.invalidateQueries({ queryKey: ["user-boxes"] });
    },
  });
}
