"use client";

import React, { useMemo, useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Minus,
  Package,
  Plus,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useSlots } from "@/hooks/slot/useSlots";
import type { SlotResponse } from "@/types/slot";
import { type CreateOrderRequest, OrderType } from "@/types/order";
import { useUser } from "@/hooks/useUser";
import { useCreateOrder } from "@/hooks/order/useCreateOrder";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/photos/photo";

const STEPS = {
  SERVICE_TYPE: 1,
  BOX_COUNT: 2,
  PHOTO_UPLOAD: 3,
  SLOT_SELECTION: 4,
  SUMMARY: 5,
} as const;

type StepNumber = (typeof STEPS)[keyof typeof STEPS];

const MIN_BOX_COUNT = 1;
const MAX_BOX_COUNT = 10;
const MAX_NOTES_LENGTH = 500;

interface StepIndicatorProps {
  currentStep: StepNumber;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = memo(
  ({ currentStep, totalSteps }) => {
    return (
      <div
        className="flex items-center justify-between mb-6"
        role="navigation"
        aria-label="Order creation progress"
      >
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step < currentStep
                  ? "bg-green-500 text-white"
                  : step === currentStep
                    ? "bg-[#1742B1] text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${step} of ${totalSteps}`}
            >
              {step < currentStep ? (
                <Check className="w-4 h-4" aria-hidden="true" />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

StepIndicator.displayName = "StepIndicator";

interface SlotCardProps {
  slot: SlotResponse;
  isSelected: boolean;
  onSelect: () => void;
  formatDateTime: (date: string) => { date: string; time: string };
}

const SlotCard: React.FC<SlotCardProps> = memo(
  ({ slot, isSelected, onSelect, formatDateTime }) => {
    const { date, time } = formatDateTime(slot.start_time);
    const endTime = formatDateTime(slot.end_time).time;

    return (
      <Card
        className={`cursor-pointer transition-all ${
          !slot.is_available
            ? "opacity-50 cursor-not-allowed"
            : isSelected
              ? "ring-2 ring-[#1742B1] bg-[#E8F0FE]"
              : "hover:bg-gray-50"
        }`}
        onClick={() => slot.is_available && onSelect()}
        role="radio"
        aria-checked={isSelected}
        aria-disabled={!slot.is_available}
        tabIndex={slot.is_available ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{date}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <time>
                  {time} - {endTime}
                </time>
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={slot.is_available ? "default" : "secondary"}
                aria-label={slot.is_available ? "Available" : "Not available"}
              >
                {slot.is_available ? "Available" : "Full"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {slot.available_capacity} spot
                {slot.available_capacity !== 1 ? "s" : ""} left
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

SlotCard.displayName = "SlotCard";

const OrderWizard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepNumber>(
    STEPS.SERVICE_TYPE,
  );
  const [sessionId] = useState(() => crypto.randomUUID());
  const [orderData, setOrderData] = useState<Partial<CreateOrderRequest>>({
    order_type: OrderType.SELF_DROPOFF,
    box_count: MIN_BOX_COUNT,
    photo_urls: [],
  });
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);

  const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  // Fixed date range calculation
  const dateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 14);

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 28);

    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };
  }, []);

  const { data: availableSlots, isLoading: isLoadingSlots } =
    useSlots(dateRange);

  // Reset wizard state
  const resetWizard = useCallback(() => {
    setCurrentStep(STEPS.SERVICE_TYPE);
    setOrderData({
      order_type: OrderType.SELF_DROPOFF,
      box_count: MIN_BOX_COUNT,
      photo_urls: [],
    });
    setSelectedSlot(null);
  }, []);

  // Modal handlers
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    resetWizard();
  }, [resetWizard]);

  const handleCloseModal = useCallback(() => {
    if (!isCreatingOrder) {
      setIsModalOpen(false);
      resetWizard();
    }
  }, [isCreatingOrder, resetWizard]);

  // Navigation handlers
  const nextStep = useCallback(() => {
    if (currentStep < STEPS.SUMMARY) {
      setCurrentStep((currentStep + 1) as StepNumber);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > STEPS.SERVICE_TYPE) {
      setCurrentStep((currentStep - 1) as StepNumber);
    }
  }, [currentStep]);

  // Box count handlers
  const updateBoxCount = useCallback((increment: boolean) => {
    setOrderData((prev) => ({
      ...prev,
      box_count: increment
        ? Math.min(MAX_BOX_COUNT, (prev.box_count || MIN_BOX_COUNT) + 1)
        : Math.max(MIN_BOX_COUNT, (prev.box_count || MIN_BOX_COUNT) - 1),
    }));
  }, []);

  // Photo handlers
  const handlePhotosChange = useCallback((photos: string[]) => {
    setOrderData((prev) => ({ ...prev, photo_urls: photos }));
  }, []);

  // Format date/time helper
  const formatDateTime = useCallback((isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: "Invalid date", time: "Invalid time" };
    }
  }, []);

  // Handle order submission
  const handleSubmit = useCallback(() => {
    if (!user || !selectedSlot) {
      toast.error("Missing required information");
      return;
    }

    const finalOrder: CreateOrderRequest = {
      ...orderData,
      session_id: sessionId,
      photo_urls: orderData.photo_urls || [],
      slot_id: selectedSlot.id,
      scheduled_date: selectedSlot.start_time,
      address: {
        street: [user.address_line_1, user.address_line_2]
          .filter(Boolean)
          .join(" ")
          .trim(),
        zip_code: user.postal_code || "",
        city: user.city || "",
        country: user.country || "",
      },
    } as CreateOrderRequest;

    createOrder(finalOrder, {
      onSuccess: () => {
        toast.success("Order successfully created");
        handleCloseModal();
      },
      onError: (error) => {
        toast.error(error?.name || "Failed to create order", {
          description: error?.message || "Please try again later",
        });
      },
    });
  }, [user, selectedSlot, orderData, createOrder, handleCloseModal, sessionId]);

  // Validation for proceeding to next step
  const canProceedFromStep = useCallback(
    (step: StepNumber): boolean => {
      switch (step) {
        case STEPS.SERVICE_TYPE:
          return orderData.order_type !== undefined;
        case STEPS.BOX_COUNT:
          return (orderData.box_count || 0) >= MIN_BOX_COUNT;
        case STEPS.PHOTO_UPLOAD:
          return (orderData.photo_urls?.length || 0) > 0;
        case STEPS.SLOT_SELECTION:
          return selectedSlot !== null;
        case STEPS.SUMMARY:
          return !isCreatingOrder && !isLoadingUser && !!user;
        default:
          return true;
      }
    },
    [orderData, selectedSlot, isCreatingOrder, isLoadingUser, user],
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_NOTES_LENGTH) {
        setOrderData((prev) => ({ ...prev, notes: value }));
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && !isCreatingOrder) {
        handleCloseModal();
      }
    },
    [isCreatingOrder, handleCloseModal],
  );

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-[#1742B1] text-white px-6 py-2.5 rounded-md font-semibold text-sm uppercase tracking-wider hover:bg-[#14399F] hover:shadow-md transition-all duration-200 w-full md:w-auto flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1] focus:ring-offset-2"
        aria-label="Create new storage order"
      >
        <Package className="w-5 h-5 mr-2" aria-hidden="true" />
        Create Order
      </button>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onKeyDown={handleKeyDown}
          aria-describedby="order-wizard-description"
        >
          <DialogHeader>
            <DialogTitle id="order-wizard-title">
              Create Storage Order
            </DialogTitle>
            <span id="order-wizard-description" className="sr-only">
              Step {currentStep} of {Object.keys(STEPS).length}: Create a new
              storage order
            </span>
          </DialogHeader>

          <StepIndicator
            currentStep={currentStep}
            totalSteps={Object.keys(STEPS).length}
          />

          {/* User error alert */}
          {userError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription>
                Failed to load user information. Please refresh and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Service Type Selection */}
          {currentStep === STEPS.SERVICE_TYPE && (
            <div
              className="space-y-4"
              role="group"
              aria-labelledby="service-type-heading"
            >
              <h3 id="service-type-heading" className="text-lg font-semibold">
                Choose Your Service Type
              </h3>
              <div className="grid gap-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    orderData.order_type === OrderType.SELF_DROPOFF
                      ? "ring-2 ring-[#1742B1] bg-[#E8F0FE]"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setOrderData((prev) => ({
                      ...prev,
                      order_type: OrderType.SELF_DROPOFF,
                    }))
                  }
                  role="radio"
                  aria-checked={orderData.order_type === OrderType.SELF_DROPOFF}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOrderData((prev) => ({
                        ...prev,
                        order_type: OrderType.SELF_DROPOFF,
                      }));
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" aria-hidden="true" />
                      Self Drop-off
                    </CardTitle>
                    <CardDescription>
                      Deliver your packed belongings to our warehouse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Perfect for users who prefer to handle packing and
                      delivery themselves. Simply bring your packed boxes to our
                      secure facility.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="opacity-50 cursor-not-allowed"
                  aria-disabled="true"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" aria-hidden="true" />
                      Ready for Pickup
                      <Badge variant="secondary">Coming Soon</Badge>
                    </CardTitle>
                    <CardDescription>
                      We&#39;ll come to you and handle the pickup process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ideal for users who have items packed and ready for
                      professional pickup service.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Box Count Selection */}
          {currentStep === STEPS.BOX_COUNT && (
            <div
              className="space-y-4"
              role="group"
              aria-labelledby="box-count-heading"
            >
              <h3 id="box-count-heading" className="text-lg font-semibold">
                How many boxes do you have?
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => updateBoxCount(false)}
                  disabled={
                    (orderData.box_count || MIN_BOX_COUNT) <= MIN_BOX_COUNT
                  }
                  className="w-10 h-10 rounded-md border border-[#DADCE0] bg-white hover:bg-[#F5F7FA] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                  aria-label="Decrease box count"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <div
                  className="text-4xl font-bold w-20 text-center text-[#333333]"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {orderData.box_count || MIN_BOX_COUNT}
                </div>
                <button
                  onClick={() => updateBoxCount(true)}
                  disabled={
                    (orderData.box_count || MIN_BOX_COUNT) >= MAX_BOX_COUNT
                  }
                  className="w-10 h-10 rounded-md border border-[#DADCE0] bg-white hover:bg-[#F5F7FA] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                  aria-label="Increase box count"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="text-center text-muted-foreground">
                {orderData.box_count === 1
                  ? "1 box"
                  : `${orderData.box_count} boxes`}{" "}
                selected for storage
              </p>
              {orderData.box_count === MAX_BOX_COUNT && (
                <p className="text-center text-sm text-[#FF9900]" role="alert">
                  Maximum of {MAX_BOX_COUNT} boxes allowed per order
                </p>
              )}
            </div>
          )}

          {/* Step 3: Photo Upload */}
          {currentStep === STEPS.PHOTO_UPLOAD && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                  Upload Photos of Your Boxes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please provide clear photos of your packed boxes for
                  verification. You can upload up to {orderData.box_count} photo
                  {orderData.box_count !== 1 ? "s" : ""}.
                </p>
              </div>

              <PhotoUpload
                sessionId={sessionId}
                maxFiles={orderData.box_count || MIN_BOX_COUNT}
                maxFileSize={10 * 1024 * 1024}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                onPhotosChange={handlePhotosChange}
              />
            </div>
          )}

          {/* Step 4: Slot Selection */}
          {currentStep === STEPS.SLOT_SELECTION && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Choose Your Drop-off Time
              </h3>

              {isLoadingSlots ? (
                <div className="grid gap-3" aria-busy="true" aria-live="polite">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : availableSlots?.slots && availableSlots.slots.length > 0 ? (
                <div
                  className="grid gap-3 max-h-64 overflow-y-auto"
                  role="radiogroup"
                  aria-label="Available time slots"
                >
                  {availableSlots.slots.map((slot: SlotResponse) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedSlot?.id === slot.id}
                      onSelect={() => setSelectedSlot(slot)}
                      formatDateTime={formatDateTime}
                    />
                  ))}
                </div>
              ) : (
                <Alert role="alert">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>
                    No available slots found. Please try a different date range.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === STEPS.SUMMARY && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-medium">Service Type</dt>
                      <dd className="text-sm">Self Drop-off</dd>
                    </div>

                    <Separator />

                    <div>
                      <dt className="font-medium">Number of Boxes</dt>
                      <dd className="text-sm">
                        {orderData.box_count}{" "}
                        {orderData.box_count === 1 ? "box" : "boxes"}
                      </dd>
                    </div>

                    <Separator />

                    <div>
                      <dt className="font-medium">Photos</dt>
                      <dd className="text-sm">
                        {orderData.photo_urls?.length || 0} photo
                        {(orderData.photo_urls?.length || 0) !== 1
                          ? "s"
                          : ""}{" "}
                        uploaded
                      </dd>
                    </div>

                    <Separator />

                    {selectedSlot && (
                      <div>
                        <dt className="font-medium">Drop-off Schedule</dt>
                        <dd className="text-sm">
                          {formatDateTime(selectedSlot.start_time).date}
                          <br />
                          <span className="text-muted-foreground">
                            {formatDateTime(selectedSlot.start_time).time} -{" "}
                            {formatDateTime(selectedSlot.end_time).time}
                          </span>
                        </dd>
                      </div>
                    )}

                    {user && (
                      <>
                        <Separator />
                        <div>
                          <dt className="font-medium">Drop-off Address</dt>
                          <dd className="text-sm">
                            Sort Warehouse
                            <br />
                            <span className="text-muted-foreground">
                              Address will be provided after confirmation
                            </span>
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  Additional Notes (Optional)
                  <span className="text-muted-foreground text-sm ml-1">
                    ({orderData.notes?.length || 0}/{MAX_NOTES_LENGTH})
                  </span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or notes..."
                  value={orderData.notes || ""}
                  onChange={handleNotesChange}
                  maxLength={MAX_NOTES_LENGTH}
                  className="resize-none"
                  aria-describedby="notes-hint"
                />
                <p
                  id="notes-hint"
                  className="text-xs text-muted-foreground text-right"
                >
                  {orderData.notes?.length || 0}/{MAX_NOTES_LENGTH} characters
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={prevStep}
              disabled={currentStep === STEPS.SERVICE_TYPE}
              className="px-5 py-2 bg-transparent border border-[#1742B1] text-[#1742B1] rounded-md text-sm font-medium hover:bg-[#F5F7FA] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
              aria-label="Go to previous step"
            >
              <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Previous
            </button>

            {currentStep < STEPS.SUMMARY ? (
              <button
                onClick={nextStep}
                disabled={!canProceedFromStep(currentStep)}
                className="px-5 py-2 bg-[#1742B1] text-white rounded-md text-sm font-medium hover:bg-[#14399F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                aria-label="Go to next step"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceedFromStep(currentStep) || isCreatingOrder}
                className="px-5 py-2 bg-[#1742B1] text-white rounded-md text-sm font-medium hover:bg-[#14399F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                aria-label={
                  isCreatingOrder ? "Creating order..." : "Submit order"
                }
              >
                {isCreatingOrder ? (
                  <>Creating Order...</>
                ) : (
                  <>
                    Submit Order
                    <Check className="w-4 h-4 ml-2" aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(OrderWizard);
