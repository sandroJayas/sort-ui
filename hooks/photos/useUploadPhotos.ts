"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhotoUploadBulkResponse } from "@/types/photos";

interface UploadPhotosParams {
  sessionId: string;
  photos: File[];
}

export function useUploadPhotos() {
  const queryClient = useQueryClient();

  return useMutation<PhotoUploadBulkResponse, Error, UploadPhotosParams>({
    mutationFn: async ({ sessionId, photos }) => {
      // Create FormData
      const formData = new FormData();
      formData.append("session_id", sessionId);

      // Append all photos
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await res.json();

      // Handle different status codes
      if (res.status === 201) {
        // Full success
        return data;
      } else if (res.status === 206) {
        // Partial success - still return data but maybe handle differently in onSuccess
        return data;
      } else if (!res.ok) {
        // Error case
        throw new Error(
          data.error || data.message || "Failed to upload photos",
        );
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate any photo-related queries
      queryClient.invalidateQueries({ queryKey: ["photos"] });

      // If there's a session ID, invalidate session photos
      if (data.session_id) {
        queryClient.invalidateQueries({
          queryKey: ["session-photos", data.session_id],
        });
      }
    },
  });
}
