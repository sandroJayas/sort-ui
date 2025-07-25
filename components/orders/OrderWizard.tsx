"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
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

const MIN_BOX_COUNT = 1;
const MAX_BOX_COUNT = 10;

const OrderWizard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessioId] = useState(() => crypto.randomUUID());
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
    setSessioId(() => crypto.randomUUID());
  }, []);

  // Modal handlers
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    resetWizard();
  }, [resetWizard]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetWizard();
  }, [resetWizard]);

  // Navigation handlers
  const nextStep = useCallback(() => {
    if (currentStep < STEPS.SUMMARY) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > STEPS.SERVICE_TYPE) {
      setCurrentStep(currentStep - 1);
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
  }, [user, selectedSlot, orderData, createOrder, handleCloseModal]);

  // Validation for proceeding to next step
  const canProceedFromStep = useCallback(
    (step: number): boolean => {
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

  // Loading skeleton for slots
  const SlotsSkeleton = () => (
    <div className="grid gap-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <Button onClick={handleOpenModal} size="lg" className="px-8">
          <Package className="w-5 h-5 mr-2" />
          Create Order
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Storage Order</DialogTitle>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              {Object.values(STEPS).map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < STEPS.SUMMARY && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors ${
                        step < currentStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* User error alert */}
            {userError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load user information. Please refresh and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: Service Type Selection */}
            {currentStep === STEPS.SERVICE_TYPE && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Choose Your Service Type
                </h3>
                <div className="grid gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      orderData.order_type === OrderType.SELF_DROPOFF
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setOrderData((prev) => ({
                        ...prev,
                        order_type: OrderType.SELF_DROPOFF,
                      }))
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Self Drop-off
                      </CardTitle>
                      <CardDescription>
                        Deliver your packed belongings to our warehouse
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Perfect for users who prefer to handle packing and
                        delivery themselves. Simply bring your packed boxes to
                        our secure facility.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="opacity-50 cursor-not-allowed">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  How many boxes do you have?
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBoxCount(false)}
                    disabled={
                      (orderData.box_count || MIN_BOX_COUNT) <= MIN_BOX_COUNT
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-4xl font-bold w-20 text-center">
                    {orderData.box_count || MIN_BOX_COUNT}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBoxCount(true)}
                    disabled={
                      (orderData.box_count || MIN_BOX_COUNT) >= MAX_BOX_COUNT
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-center text-muted-foreground">
                  {orderData.box_count === 1
                    ? "1 box"
                    : `${orderData.box_count} boxes`}{" "}
                  selected for storage
                </p>
                {orderData.box_count === MAX_BOX_COUNT && (
                  <p className="text-center text-sm text-orange-600">
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
                    <Camera className="w-5 h-5" />
                    Upload Photos of Your Boxes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide clear photos of your packed boxes for
                    verification. You can upload up to {orderData.box_count}{" "}
                    photo
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
                  <Calendar className="w-5 h-5" />
                  Choose Your Drop-off Time
                </h3>

                {isLoadingSlots ? (
                  <SlotsSkeleton />
                ) : availableSlots?.slots && availableSlots.slots.length > 0 ? (
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {availableSlots.slots.map((slot: SlotResponse) => {
                      const { date, time } = formatDateTime(slot.start_time);
                      const endTime = formatDateTime(slot.end_time).time;

                      return (
                        <Card
                          key={slot.id}
                          className={`cursor-pointer transition-all ${
                            !slot.is_available
                              ? "opacity-50 cursor-not-allowed"
                              : selectedSlot?.id === slot.id
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : "hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            slot.is_available && setSelectedSlot(slot)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{date}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {time} - {endTime}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    slot.is_available ? "default" : "secondary"
                                  }
                                >
                                  {slot.is_available ? "Available" : "Full"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
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
                      No available slots found. Please try a different date
                      range.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 5: Recap and Submit */}
            {currentStep === STEPS.SUMMARY && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="font-medium">Service Type</Label>
                      <p className="text-sm">Self Drop-off</p>
                    </div>

                    <Separator />

                    <div>
                      <Label className="font-medium">Number of Boxes</Label>
                      <p className="text-sm">
                        {orderData.box_count}{" "}
                        {orderData.box_count === 1 ? "box" : "boxes"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <Label className="font-medium">Photos</Label>
                      <p className="text-sm">
                        {orderData.photo_urls?.length || 0} photo
                        {(orderData.photo_urls?.length || 0) !== 1
                          ? "s"
                          : ""}{" "}
                        uploaded
                      </p>
                    </div>

                    <Separator />

                    {selectedSlot && (
                      <div>
                        <Label className="font-medium">Drop-off Schedule</Label>
                        <p className="text-sm">
                          {formatDateTime(selectedSlot.start_time).date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(selectedSlot.start_time).time} -{" "}
                          {formatDateTime(selectedSlot.end_time).time}
                        </p>
                      </div>
                    )}

                    {user && (
                      <>
                        <Separator />
                        <div>
                          <Label className="font-medium">
                            Drop-off Address
                          </Label>
                          <p className="text-sm">Sort Warehouse</p>
                          <p className="text-sm text-muted-foreground">
                            Address will be provided after confirmation
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    value={orderData.notes || ""}
                    onChange={(e) =>
                      setOrderData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {orderData.notes?.length || 0}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === STEPS.SERVICE_TYPE}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.SUMMARY ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedFromStep(currentStep)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedFromStep(currentStep) || isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>Creating Order...</>
                  ) : (
                    <>
                      Submit Order
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderWizard;
