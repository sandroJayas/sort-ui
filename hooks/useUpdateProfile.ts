"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileRequest, User } from "@/types/user";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<User> => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const response = await res.json();
      return response.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] }); // refresh useUser()
    },
  });
}
