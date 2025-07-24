"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeletePhotoResponse {
  message: string;
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation<DeletePhotoResponse, Error, string>({
    mutationFn: async (photoId: string) => {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to delete photo");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate photo-related queries
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["session-photos"] });
    },
  });
}
