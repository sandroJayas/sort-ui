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
  Upload,
  MapPin,
} from "lucide-react";
import { useSlots } from "@/hooks/slot/useSlots";
import type { SlotResponse } from "@/types/slot";
import { type CreateOrderRequest, OrderType } from "@/types/order";
import { useUser } from "@/hooks/useUser";
import { useCreateOrder } from "@/hooks/order/useCreateOrder";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/photos/photo";
import { isUserValid } from "@/lib/utils";

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

const STEP_TITLES: Record<StepNumber, string> = {
  1: "Service Type",
  2: "Box Count",
  3: "Photos",
  4: "Schedule",
  5: "Review",
};

interface StepIndicatorProps {
  currentStep: StepNumber;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = memo(
  ({ currentStep, totalSteps }) => {
    return (
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

        {/* Active Progress Bar */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#1742B1] transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${
                  step < currentStep
                    ? "bg-[#1742B1] text-white"
                    : step === currentStep
                      ? "bg-[#1742B1] text-white shadow-lg shadow-[#1742B1]/25"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                }
              `}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              <span
                className={`
              mt-2 text-xs font-medium transition-colors
              ${step <= currentStep ? "text-gray-900" : "text-gray-400"}
            `}
              >
                {STEP_TITLES[step as StepNumber]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

StepIndicator.displayName = "StepIndicator";

const OrderWizard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepNumber>(
    STEPS.SERVICE_TYPE,
  );
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [orderData, setOrderData] = useState<Partial<CreateOrderRequest>>({
    order_type: OrderType.SELF_DROPOFF,
    box_count: MIN_BOX_COUNT,
    photo_urls: [],
  });
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);

  const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

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

  const resetWizard = useCallback(() => {
    setCurrentStep(STEPS.SERVICE_TYPE);
    setOrderData({
      order_type: OrderType.SELF_DROPOFF,
      box_count: MIN_BOX_COUNT,
      photo_urls: [],
    });
    setSelectedSlot(null);
    setSessionId(() => crypto.randomUUID());
  }, []);

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

  const updateBoxCount = useCallback((increment: boolean) => {
    setOrderData((prev) => ({
      ...prev,
      box_count: increment
        ? Math.min(MAX_BOX_COUNT, (prev.box_count || MIN_BOX_COUNT) + 1)
        : Math.max(MIN_BOX_COUNT, (prev.box_count || MIN_BOX_COUNT) - 1),
    }));
  }, []);

  const handlePhotosChange = useCallback((photos: string[]) => {
    setOrderData((prev) => ({ ...prev, photo_urls: photos }));
  }, []);

  const formatDateTime = useCallback((isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: "Invalid date", time: "Invalid time" };
    }
  }, []);

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
        toast.success("Order created successfully! 🎉");
        handleCloseModal();
      },
      onError: (error) => {
        toast.error(error?.name || "Failed to create order", {
          description: error?.message || "Please try again later",
        });
      },
    });
  }, [user, selectedSlot, orderData, createOrder, handleCloseModal, sessionId]);

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

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1742B1] text-white rounded-lg font-medium text-sm hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed "
        aria-label="Create new storage order"
        disabled={!isUserValid(user)}
      >
        <Plus className="w-4 h-4" />
        Create Order
      </button>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Create Storage Order
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-6 py-6 overflow-y-auto flex-1">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={Object.keys(STEPS).length}
            />

            <div className="mt-8">
              {/* User error alert */}
              {userError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load user information. Please refresh and try
                    again.
                  </AlertDescription>
                </Alert>
              )}

              {/* Step 1: Service Type Selection */}
              {currentStep === STEPS.SERVICE_TYPE && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      How would you like to store your items?
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose the service that best fits your needs
                    </p>
                  </div>

                  <div className="grid gap-4 mt-6">
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        orderData.order_type === OrderType.SELF_DROPOFF
                          ? "ring-2 ring-[#1742B1] bg-[#1742B1]/5 border-[#1742B1]"
                          : "hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() =>
                        setOrderData((prev) => ({
                          ...prev,
                          order_type: OrderType.SELF_DROPOFF,
                        }))
                      }
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <span>Self Drop-off</span>
                        </CardTitle>
                        <CardDescription>
                          Pack and deliver your items to our secure warehouse
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Most affordable option</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Drop off at your convenience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>24/7 secure facility access</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="opacity-60 cursor-not-allowed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-5 h-5 text-purple-600" />
                          </div>
                          <span>Pickup Service</span>
                          <Badge variant="secondary" className="ml-auto">
                            Coming Soon
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          We&#39;ll pick up your packed items from your location
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 2: Box Count Selection */}
              {currentStep === STEPS.BOX_COUNT && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      How many boxes will you store?
                    </h3>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => updateBoxCount(false)}
                        disabled={
                          (orderData.box_count || MIN_BOX_COUNT) <=
                          MIN_BOX_COUNT
                        }
                        className="w-12 h-12 rounded-full border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20"
                        aria-label="Decrease box count"
                      >
                        <Minus className="w-5 h-5" />
                      </button>

                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">
                          {orderData.box_count || MIN_BOX_COUNT}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {orderData.box_count === 1 ? "box" : "boxes"}
                        </p>
                      </div>

                      <button
                        onClick={() => updateBoxCount(true)}
                        disabled={
                          (orderData.box_count || MIN_BOX_COUNT) >=
                          MAX_BOX_COUNT
                        }
                        className="w-12 h-12 rounded-full border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20"
                        aria-label="Increase box count"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {orderData.box_count === MAX_BOX_COUNT && (
                      <Alert className="max-w-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Maximum {MAX_BOX_COUNT} boxes per order. Need more?
                          Create multiple orders.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 max-w-sm w-full">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Large item? No packing needed!
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          If you&#39;re storing a large item, you don&#39;t need
                          to pack it. Just consider it as one box when selecting
                          the number of boxes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photo Upload */}
              {currentStep === STEPS.PHOTO_UPLOAD && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Upload photos of your packed boxes
                    </h3>
                    <p className="text-sm text-gray-500">
                      Take clear photos of your boxes. You can upload up to{" "}
                      {orderData.box_count} photo
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

                  <Alert className="bg-blue-50 border-blue-200">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      <strong>Photo tips:</strong> You don&#39;t need to upload
                      one photo per box. A single photo showing multiple boxes
                      is perfectly fine
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 4: Slot Selection */}
              {currentStep === STEPS.SLOT_SELECTION && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Choose your drop-off time
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select a 2-hour window that works best for you
                    </p>
                  </div>

                  {isLoadingSlots ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 bg-gray-100 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : availableSlots?.slots &&
                    availableSlots.slots.length > 0 ? (
                    <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                      {availableSlots.slots.map((slot: SlotResponse) => {
                        const { date, time } = formatDateTime(slot.start_time);
                        const endTime = formatDateTime(slot.end_time).time;

                        return (
                          <Card
                            key={slot.id}
                            className={`cursor-pointer transition-all duration-200 m-1 ${
                              !slot.is_available
                                ? "opacity-50 cursor-not-allowed"
                                : selectedSlot?.id === slot.id
                                  ? "ring-2 ring-[#1742B1] bg-[#1742B1]/5 border-[#1742B1]"
                                  : "hover:border-gray-300 hover:shadow-sm"
                            }`}
                            onClick={() =>
                              slot.is_available && setSelectedSlot(slot)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {date}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {time} - {endTime}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {slot.is_available ? (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      Available
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Full</Badge>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {slot.available_capacity} spot
                                    {slot.available_capacity !== 1
                                      ? "s"
                                      : ""}{" "}
                                    left
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No available slots found. Please contact support for
                        assistance.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Step 5: Summary */}
              {currentStep === STEPS.SUMMARY && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Review your order
                    </h3>
                    <p className="text-sm text-gray-500">
                      Double-check everything before submitting
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Order Details Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Order Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Service Type
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            Self Drop-off
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Number of Boxes
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {orderData.box_count}{" "}
                            {orderData.box_count === 1 ? "box" : "boxes"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Photos Uploaded
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {orderData.photo_urls?.length || 0} photo
                            {(orderData.photo_urls?.length || 0) !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                        {selectedSlot && (
                          <div className="flex justify-between items-start py-2">
                            <span className="text-sm text-gray-600">
                              Drop-off Schedule
                            </span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDateTime(selectedSlot.start_time).date}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(selectedSlot.start_time).time} -{" "}
                                {formatDateTime(selectedSlot.end_time).time}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Warehouse Location */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Drop-off Location
                            </p>
                            <p className="text-sm text-gray-700">
                              Sort Warehouse
                              <br />
                              591 Central Ave, Brooklyn, NY 11207
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="notes"
                        className="text-sm font-medium text-gray-700"
                      >
                        Additional Notes
                        <span className="text-gray-400 font-normal ml-1">
                          (Optional)
                        </span>
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions or notes for our team..."
                        value={orderData.notes || ""}
                        onChange={handleNotesChange}
                        maxLength={MAX_NOTES_LENGTH}
                        className="resize-none h-20"
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {orderData.notes?.length || 0}/{MAX_NOTES_LENGTH}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStep === STEPS.SERVICE_TYPE}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Go to previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {Object.keys(STEPS).length}
              </span>
            </div>

            {currentStep < STEPS.SUMMARY ? (
              <button
                onClick={nextStep}
                disabled={!canProceedFromStep(currentStep)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1742B1] text-white rounded-lg font-medium text-sm hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Go to next step"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceedFromStep(currentStep) || isCreatingOrder}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1742B1] text-white rounded-lg font-medium text-sm hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isCreatingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Order
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
