"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhotoUploadRequest, PhotoUploadResponse } from "@/types/order";

interface UploadPhotosPayload {
  orderId: string;
  photos: string[];
}

export function useUploadOrderPhotos() {
  const queryClient = useQueryClient();

  return useMutation<PhotoUploadResponse, Error, UploadPhotosPayload>({
    mutationFn: async ({ orderId, photos }) => {
      const res = await fetch(`/api/orders/${orderId}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos } as PhotoUploadRequest),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload photos");
      }

      return data;
    },
    onSuccess: (_, { orderId }) => {
      // Invalidate order to refresh with new photos
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}
