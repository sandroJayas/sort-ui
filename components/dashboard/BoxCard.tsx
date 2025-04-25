"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShipmentTracker from "@/components/dashboard/ShipmentTracker";
import { Box } from "@/types/box";
import { useUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { formatTimeForDisplay } from "@/lib/utils";
import { useUpdateBoxStatus } from "@/hooks/useUpdateBoxStatus";
import NextStepDialogButton from "@/components/dashboard/NextStepDialog";

const BoxCard = ({ box }: { box: Box }) => {
  const { data: user, isLoading, error } = useUser();
  const { mutate, isPending } = useUpdateBoxStatus();

  const handleReceived = () => {
    mutate(
      { id: box.id, status: "pending_pack" },
      {
        onSuccess: (message) => {
          toast.success(message);
        },
        onError: (error) => {
          toast.error("Update failed", {
            description: (error as Error).message,
          });
        },
      },
    );
  };

  const handlePickUp = () => {
    mutate(
      { id: box.id, status: "pending_pickup" },
      {
        onSuccess: (message) => {
          toast.success(message);
        },
        onError: (error) => {
          toast.error("Update failed", {
            description: (error as Error).message,
          });
        },
      },
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.name, {
        description: error?.message,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-10">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              BOX ORDER PLACED
            </div>
            <div>{formatTimeForDisplay(box.created_at)}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">TYPE</div>
            <div>{box.packing_mode === "self" ? "Self Packing" : "Sort"}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              SHIP TO
            </div>
            <div className="flex items-center">
              {user?.first_name + " " + user?.last_name}
            </div>
            <div className="flex items-center">{box.pickup_address.street}</div>
            <div className="flex items-center">
              {box.pickup_address.zip_code +
                ", " +
                box.pickup_address.city +
                ", " +
                box.pickup_address.country}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              TOTAL
            </div>
            <div>$78.50</div>
          </div>
        </div>

        {box.status === "stored" ? null : (
          <div className=" md:flex-row justify-between items-start md:items-center mt-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <ShipmentTracker
                currentStatus={box.status}
                trackingNumber="TRK987654321"
                estimatedDelivery="April 24, 2025"
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex gap-4 w-full">
              <div className="mb-2">
                <div className="font-medium">{box.items[0].name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  In this box i have:
                  <br />
                  Put some description here
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-grow w-full">
              {(() => {
                switch (box.status) {
                  case "in_transit":
                    return (
                      <NextStepDialogButton
                        option={box.status}
                        action={handleReceived}
                        isPending={isPending}
                      />
                    );
                  case "pending_pack":
                    return (
                      <NextStepDialogButton
                        option={box.status}
                        action={handlePickUp}
                        isPending={isPending}
                      />
                    );
                  default:
                    return null;
                }
              })()}
              <Button variant="outline">Edit Box</Button>
              <Button variant="outline">Add pictures</Button>
              <Button variant="outline">Get box support</Button>
              <Button variant="outline">Return Box</Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button
            variant="link"
            className="text-blue-600 p-0 h-auto"
            disabled={
              box.status === "stored" ||
              box.status === "disposed" ||
              box.status === "pending_pickup"
            }
          >
            Cancel Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxCard;
