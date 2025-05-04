"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useCreateBox } from "@/hooks/useCreateBox";
import { toast } from "sonner";
import ChooseMethodStep from "./steps/ChooseMethodStep";
import DetailsStep from "./steps/DetailsStep";
import ShippingStep from "./steps/ShippingStep";
import ReviewStep from "./steps/ReviewStep";

// Define the steps for the wizard
const steps = [
  { id: "method", title: "Choose Method" },
  { id: "details", title: "Details" },
  { id: "shipping", title: "Shipping" },
  { id: "review", title: "Review" },
];

export default function StoreBoxWizard() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [packingMethod, setPackingMethod] = useState<"self" | "sort" | null>(
    null,
  );
  const [boxCount, setBoxCount] = useState(3);
  const [appointmentDate, setAppointmentDate] = useState("");
  const { data: user, isLoading } = useUser();
  const { mutate, isPending } = useCreateBox();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (packingMethod === null) {
      return;
    }

    if (packingMethod === "sort") {
      toast.error("not implemented");
      return;
    }

    mutate(
      {
        packing_mode: packingMethod,
        item_name: "Books",
        item_note: "Pack carefully",
        pickup_address: {
          street:
            user?.address_line_1 +
            (user?.address_line_2 ? " " + user?.address_line_2 : ""),
          zip_code: user?.postal_code ?? "",
          city: user?.city ?? "",
          state: "NY",
          country: "USA",
        },
        quantity: boxCount,
      },
      {
        onSuccess: (data) => {
          toast.success(`Created box(es) with IDs: ${data.ids.join(", ")}`);
        },
        onError: (error) => {
          toast.error("Failed to create box", { description: error.message });
        },
      },
    );
    setOpen(false);
    // Reset the form
    setCurrentStep(0);
    setPackingMethod(null);
    setBoxCount(3);
    setAppointmentDate("");
  };

  const isUserValid =
    user &&
    user.first_name &&
    user.last_name &&
    user.address_line_1 &&
    user.city &&
    user.postal_code &&
    user.phone_number;

  return (
    <>
      <Button size={"lg"} onClick={() => setOpen(true)}>
        <PlusIcon />
        Store Boxes
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="bg-gray-800 p-6 text-white">
            <DialogTitle className="text-2xl font-bold">
              Store Your Items with Sort
            </DialogTitle>
          </DialogHeader>

          {/* Progress bar */}
          <div className="px-6 pt-6">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep >= index
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px]"
              >
                {currentStep === 0 && (
                  <ChooseMethodStep
                    packingMethod={packingMethod}
                    setPackingMethod={setPackingMethod}
                  />
                )}

                {currentStep === 1 && (
                  <DetailsStep
                    packingMethod={packingMethod}
                    boxCount={boxCount}
                    setBoxCount={setBoxCount}
                    appointmentDate={appointmentDate}
                    setAppointmentDate={setAppointmentDate}
                  />
                )}

                {currentStep === 2 && (
                  <ShippingStep
                    packingMethod={packingMethod}
                    user={isUserValid ? user : null}
                  />
                )}

                {currentStep === 3 && (
                  <ReviewStep
                    packingMethod={packingMethod}
                    boxCount={boxCount}
                    appointmentDate={appointmentDate}
                    user={isUserValid ? user : null}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="p-6 bg-gray-50 flex justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={currentStep === 0 && !packingMethod}
                className="bg-gray-800 hover:bg-gray-600"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gray-800 hover:bg-gray-600"
                disabled={isLoading || isPending}
              >
                Complete Order
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
