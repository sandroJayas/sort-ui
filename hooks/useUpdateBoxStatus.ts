"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoxStatus } from "@/types/box";

type UpdateBoxStatusPayload = {
  id: string;
  status: BoxStatus;
};

export function useUpdateBoxStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateBoxStatusPayload) => {
      const res = await fetch(`/api/boxes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update box status");
      }

      return data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-boxes"] }); // refresh box list
    },
  });
}
