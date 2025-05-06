"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const NextStepDialogButton = ({
  option,
  action,
  isPending,
}: {
  option: "in_transit" | "pending_pack";
  action: () => void;
  isPending: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    action();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending} className={"w-full"} size={"lg"}>
          {isPending
            ? "Updating..."
            : option === "in_transit"
              ? "Mark as Received"
              : "Request Pickup"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {option === "in_transit" ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Box Delivery</DialogTitle>
              <DialogDescription>
                Have you received your box?
                <br />
                If everything looks good, click Confirm Received
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleAction}>Confirm Received</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request Box Pickup</DialogTitle>
              <DialogDescription>
                Have you finished packing your items into the box?
                <br />
                Request a pickup and Sort will schedule a courier to collect
                your box
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleAction}>Request Pickup</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NextStepDialogButton;
