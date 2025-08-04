"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateBoxRequest } from "@/types/box";
import { SuccessResponse } from "@/types/order";

interface UpdateBoxPayload {
  boxId: string;
  data: UpdateBoxRequest;
}

export function useUpdateBox() {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, Error, UpdateBoxPayload>({
    mutationFn: async ({ boxId, data }) => {
      const res = await fetch(`/api/boxes/${boxId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update box");
      }

      return responseData;
    },
    onSuccess: (_, { boxId }) => {
      // Invalidate specific box and boxes list
      queryClient.invalidateQueries({ queryKey: ["box", boxId] });
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
    },
  });
}
