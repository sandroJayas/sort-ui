"use client";

import React, { useState, useCallback, memo } from "react";
import { Calendar, MoreVertical, Package, MapPin, X, Home } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRequestBoxReturn } from "@/hooks/box/useRequestBoxReturn";
import { useUser } from "@/hooks/useUser";
import type { BoxListResponse } from "@/types/box";
import type { Address } from "@/types/order";

interface BoxCardProps {
  box: BoxListResponse;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const BoxCard: React.FC<BoxCardProps> = memo(({ box }) => {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();
  const { mutate: requestReturn } = useRequestBoxReturn();

  // Form state for return request
  const [returnAddress, setReturnAddress] = useState<Address>({
    street: user?.address_line_1 || "",
    zip_code: user?.postal_code || "",
    city: user?.city || "",
    country: user?.country || "United States",
  });
  const [notes, setNotes] = useState("");

  const handleRequestReturn = useCallback(async () => {
    // Validate address
    if (
      !returnAddress.street ||
      !returnAddress.zip_code ||
      !returnAddress.city
    ) {
      toast.error("Please provide a complete delivery address");
      return;
    }

    setIsSubmitting(true);
    requestReturn(
      {
        box_ids: [box.id],
        delivery_address: returnAddress,
        notes: notes.trim(),
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setShowReturnModal(false);
          setNotes("");
          toast.success("Return request submitted successfully");
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error("Failed to request return", {
            description: error.message || "Please try again later",
          });
        },
      },
    );
  }, [box.id, returnAddress, notes, requestReturn]);

  const handleCloseModal = useCallback(() => {
    if (!isSubmitting) {
      setShowReturnModal(false);
      setNotes("");
    }
  }, [isSubmitting]);

  const handleAddressChange = useCallback(
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setReturnAddress((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    },
    [],
  );

  const boxName = box.name || `Box ${box.id.split("-")[0].toUpperCase()}`;

  return (
    <>
      <article
        className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
        aria-label={`Stored box: ${boxName}`}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {boxName}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: #{box.id.split("-").slice(-1)[0].toUpperCase()}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Box actions menu"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setShowReturnModal(true)}
                  className="text-blue-600 focus:text-blue-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Request Return
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {box.location || "Warehouse A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Stored Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(box.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border bg-green-50 border-green-200 text-green-700">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Stored Safely
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowReturnModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Request Return
          </button>
        </div>
      </article>

      {/* Return Request Modal */}
      <Dialog open={showReturnModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </button>

          <DialogHeader>
            <DialogTitle>Request Box Return</DialogTitle>
            <DialogDescription>
              We&#39;ll deliver this box to your specified address within 2-3
              business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Box Name</dt>
                  <dd className="font-medium text-gray-900">{boxName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Box ID</dt>
                  <dd className="font-medium text-gray-900">
                    #{box.id.split("-").slice(-1)[0].toUpperCase()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Current Location</dt>
                  <dd className="font-medium text-gray-900">
                    {box.location || "Warehouse A"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="street"
                  className="text-sm font-medium text-gray-700"
                >
                  Delivery Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={returnAddress.street}
                  onChange={handleAddressChange("street")}
                  className="mt-1"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700"
                  >
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={returnAddress.city}
                    onChange={handleAddressChange("city")}
                    className="mt-1"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="zip"
                    className="text-sm font-medium text-gray-700"
                  >
                    ZIP Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={returnAddress.zip_code}
                    onChange={handleAddressChange("zip_code")}
                    className="mt-1"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-700"
                >
                  Delivery Instructions
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for delivery..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestReturn}
              disabled={
                isSubmitting ||
                !returnAddress.street ||
                !returnAddress.city ||
                !returnAddress.zip_code
              }
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Requesting..." : "Request Return"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

BoxCard.displayName = "BoxCard";

export default BoxCard;
