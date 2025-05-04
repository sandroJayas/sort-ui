"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  ChevronLeft,
  ChevronRight,
  Box,
  PackageCheck,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useCreateBox } from "@/hooks/useCreateBox";
import { toast } from "sonner";

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
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">
                      How would you like to pack your items?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={cn(
                          "border rounded-lg p-6 cursor-pointer transition-all",
                          packingMethod === "self"
                            ? "border-gray-800 bg-purple-50"
                            : "border-gray-200 hover:border-gray-600",
                        )}
                        onClick={() => setPackingMethod("self")}
                      >
                        <div className="flex items-center justify-center mb-4">
                          <Box className="w-12 h-12 text-gray-800" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-2">
                          Self Packing
                        </h4>
                        <p className="text-sm text-gray-600 text-center">
                          We deliver boxes to you, you pack them, and we pick
                          them up for storage.
                        </p>
                      </div>
                      <div
                        className={cn(
                          "border rounded-lg p-6 cursor-pointer transition-all",
                          packingMethod === "sort"
                            ? "border-gray-800 bg-purple-50"
                            : "border-gray-200 hover:border-gray-600",
                        )}
                        onClick={() => setPackingMethod("sort")}
                      >
                        <div className="flex items-center justify-center mb-4">
                          <PackageCheck className="w-12 h-12 text-gray-800" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-2">
                          Packed by Sort
                        </h4>
                        <p className="text-sm text-gray-600 text-center">
                          Our team comes to your home, packs everything, and
                          creates an inventory.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    {packingMethod === "self" ? (
                      <>
                        <h3 className="text-xl font-semibold">
                          How many boxes do you need?
                        </h3>
                        <p className="text-gray-600">
                          We&#39;ll deliver these boxes to your address for you
                          to pack.
                        </p>

                        <div className="flex items-center justify-center space-x-4 my-8">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBoxCount(Math.max(1, boxCount - 1))
                            }
                            disabled={boxCount <= 1}
                          >
                            -
                          </Button>
                          <div className="text-4xl font-bold text-gray-800 w-16 text-center">
                            {boxCount}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setBoxCount(Math.min(10, boxCount + 1))
                            }
                            disabled={boxCount >= 10}
                          >
                            +
                          </Button>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-800">
                            Each box is 24&#34; x 18&#34; x 18&#34; and can hold
                            up to 30 lbs.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold">
                          Schedule a packing appointment
                        </h3>
                        <p className="text-gray-600">
                          Select when you&#39;d like our team to come to your
                          home.
                        </p>

                        <div className="space-y-4 my-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Preferred date and time
                          </label>
                          <input
                            type="datetime-local"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-800">
                            Our team will arrive within a 2-hour window of your
                            selected time.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">
                      Shipping Information
                    </h3>
                    <p className="text-gray-600">
                      {packingMethod === "self"
                        ? "Where should we deliver your empty boxes?"
                        : "Where should our team meet you for packing?"}
                    </p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={user?.first_name}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={user?.last_name}
                            readOnly={true}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={
                            user?.address_line_1 + " " + user?.address_line_2
                          }
                          readOnly={true}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={user?.city}
                            readOnly={true}
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={"NY"}
                            readOnly={true}
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={user?.postal_code}
                            readOnly={true}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={user?.phone_number}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Review Your Order</h3>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Service Type:</span>
                        <span>
                          {packingMethod === "self"
                            ? "Self Packing"
                            : "Packed by Sort"}
                        </span>
                      </div>

                      {packingMethod === "self" ? (
                        <div className="flex justify-between">
                          <span className="font-medium">Number of Boxes:</span>
                          <span>{boxCount}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="font-medium">Appointment:</span>
                          <span>
                            {new Date(appointmentDate).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="font-medium">Shipping Address:</span>
                        <span>
                          {user?.address_line_1 +
                            (user?.address_line_2
                              ? " " + user?.address_line_2
                              : "") +
                            ", New York, " +
                            user?.postal_code}
                        </span>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between font-bold">
                          <span>Estimated Total:</span>
                          <span>
                            $
                            {packingMethod === "self" ? boxCount * 7.99 : 99.99}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Final price may vary based on actual storage duration
                        </p>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-800">
                        By completing this order, you agree to Sort&#39;s Terms
                        of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
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
