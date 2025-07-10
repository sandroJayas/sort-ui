"use client";

import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  Camera,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { useSlots } from "@/hooks/slots/useSlots";
import { SlotResponse } from "@/types/slot";
import { CreateOrderRequest, OrderType } from "@/types/order";
import { useUser } from "@/hooks/useUser";
import { useCreateOrder } from "@/hooks/orders/useCreateOrder";
import { toast } from "sonner";

const OrderWizard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<Partial<CreateOrderRequest>>({
    order_type: OrderType.SELF_DROPOFF,
    box_count: 1,
    photo_urls: [],
  });
  const [photoUrls, setPhotoUrls] = useState<string[]>([""]);
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null);
  const { data: user } = useUser();
  const { mutate } = useCreateOrder();

  const dateRange = useMemo(() => {
    const d = new Date();
    return {
      start_date: new Date(d.setDate(d.getDate() - 14)).toISOString(),
      end_date: new Date(d.setDate(d.getDate() + 28)).toISOString(),
    };
  }, []);

  const { data: availableSlots } = useSlots(dateRange);

  const resetWizard = () => {
    setCurrentStep(1);
    setOrderData({
      order_type: OrderType.SELF_DROPOFF,
      box_count: 1,
      photo_urls: [],
    });
    setPhotoUrls([""]);
    setSelectedSlot(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetWizard();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetWizard();
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBoxCount = (increment: boolean) => {
    const newCount = increment
      ? (orderData.box_count || 1) + 1
      : Math.max(1, (orderData.box_count || 1) - 1);

    setOrderData({ ...orderData, box_count: newCount });
  };

  const addPhotoUrl = () => {
    setPhotoUrls([...photoUrls, ""]);
  };

  const removePhotoUrl = (index: number) => {
    if (photoUrls.length > 1) {
      setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    }
  };

  const updatePhotoUrl = (index: number, url: string) => {
    const newUrls = [...photoUrls];
    newUrls[index] = url;
    setPhotoUrls(newUrls);
  };

  const formatDateTime = (isoString: string) => {
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
  };

  const handleSubmit = () => {
    const finalOrder: CreateOrderRequest = {
      ...orderData,
      photo_urls: photoUrls.filter((url) => url.trim() !== ""),
      slot_id: selectedSlot?.id,
      scheduled_date: selectedSlot?.start_time,
      address: {
        street: user?.address_line_1 + " " + user?.address_line_2,
        zip_code: user?.postal_code,
        city: user?.city,
        country: user?.country,
      },
    } as CreateOrderRequest;

    mutate(finalOrder, {
      onSuccess: () => {
        toast.success("order successfully created");
      },
      onError: (error) => {
        toast.error(error?.name, {
          description: error?.message,
        });
      },
    });
    handleCloseModal();
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return orderData.order_type !== undefined;
      case 2:
        return (orderData.box_count || 0) > 0;
      case 3:
        return photoUrls.some((url) => url.trim() !== "");
      case 4:
        return selectedSlot !== null;
      default:
        return true;
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <Button onClick={handleOpenModal} size="lg" className="px-8">
          <Package className="w-5 h-5 mr-2" />
          Create Order
        </Button>

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Storage Order</DialogTitle>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Service Type Selection */}
            {currentStep === 1 && (
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
                      setOrderData({
                        ...orderData,
                        order_type: OrderType.SELF_DROPOFF,
                      })
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Self Drop-off
                      </CardTitle>
                      <CardDescription>
                        Deliver your fully packed belongings to our warehouse
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
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  How many boxes do you have?
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBoxCount(false)}
                    disabled={(orderData.box_count || 1) <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-4xl font-bold w-20 text-center">
                    {orderData.box_count}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateBoxCount(true)}
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
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Photos of Your Boxes
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please provide photos of your boxes for verification and
                  clarity.
                </p>

                <div className="space-y-3">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`photo-${index}`}>
                          Photo URL {index + 1}
                        </Label>
                        <Input
                          id={`photo-${index}`}
                          placeholder="Enter image URL"
                          value={url}
                          className="my-3"
                          onChange={(e) =>
                            updatePhotoUrl(index, e.target.value)
                          }
                        />
                      </div>
                      {photoUrls.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="mt-6 bg-transparent"
                          onClick={() => removePhotoUrl(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={addPhotoUrl}
                  className="w-full bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Photo
                </Button>
              </div>
            )}

            {/* Step 4: Slot Selection */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Choose Your Drop-off Time
                </h3>

                <div className="grid gap-3">
                  {availableSlots?.slots.map((slot: SlotResponse) => {
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
                                {slot.available_capacity} spots left
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Recap and Submit */}
            {currentStep === 5 && (
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
                        {photoUrls.filter((url) => url.trim()).length} photo(s)
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
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    value={orderData.notes || ""}
                    onChange={(e) =>
                      setOrderData({ ...orderData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedFromStep(currentStep)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Order
                  <Check className="w-4 h-4 ml-2" />
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
