"use client";

import type React from "react";
import {
  Package,
  ClipboardCheck,
  Truck,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BoxStatus } from "@/types/box";

interface ShipmentTrackerProps {
  currentStatus: BoxStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  className?: string;
}

interface StatusStep {
  id: BoxStatus;
  label: string;
  icon: React.ReactNode;
}

const ShipmentTracker = ({
  currentStatus,
  trackingNumber,
  estimatedDelivery,
  className,
}: ShipmentTrackerProps) => {
  const steps: StatusStep[] = [
    {
      id: "in_transit",
      label: "In Transit",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      id: "pending_pack",
      label: "Packing",
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: "pending_pickup",
      label: "Pickup",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "stored",
      label: "Stored",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  // Find the index of the current status
  const currentStatusIndex = steps.findIndex(
    (step) => step.id === currentStatus,
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Tracking info */}
      {(trackingNumber || estimatedDelivery) && (
        <div className="flex flex-col sm:flex-row sm:justify-between mb-6 text-sm">
          {estimatedDelivery && (
            <div>
              <span className="text-muted-foreground">
                Estimated Delivery:{" "}
              </span>
              <span className="font-medium">{estimatedDelivery}</span>
            </div>
          )}
        </div>
      )}

      {/* Tracker */}
      <div className="relative">
        {/* Line connecting all points */}
        <div
          className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"
          aria-hidden="true"
        />

        {/* Status points */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            // Determine if this step is completed, current, or pending
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center cursor-pointer group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                )}
                tabIndex={0}
                aria-label={`${step.label} ${isCompleted ? "completed" : isCurrent ? "in progress" : "pending"}`}
              >
                {/* Status circle */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-full z-10 transition-all",
                    isCompleted ? "bg-gray-600" : "bg-gray-200",
                    isCurrent ? "ring-4 ring-yellow-600" : "",
                  )}
                >
                  {isCompleted ? (
                    isCurrent ? (
                      <div className="text-white">{step.icon}</div>
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    )
                  ) : (
                    <div className="text-gray-500">{step.icon}</div>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-xs font-medium text-center">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
