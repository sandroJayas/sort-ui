"use client";

import { useMutation } from "@tanstack/react-query";
import {
  CreateBillingPortalRequest,
  BillingPortalResponse,
} from "@/types/subscription";

export function useCreateBillingPortal() {
  return useMutation<BillingPortalResponse, Error, CreateBillingPortalRequest>({
    mutationFn: async (data) => {
      const res = await fetch("/api/subscriptions/billing-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || "Failed to create billing portal session",
        );
      }

      return responseData;
    },
    onSuccess: (data) => {
      // Redirect to Stripe billing portal
      window.location.href = data.url;
    },
  });
}
