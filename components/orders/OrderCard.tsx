"use client";

import { Calendar, Clock, MoreHorizontal, Package } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCancelOrder } from "@/hooks/order/useCancelOrder";
import { toast } from "sonner";
import { OrderStatus } from "@/types/order";
import Image from "next/image";
import Link from "next/link";

export interface OrderListResponse {
  id: string;
  order_type: string;
  status: string;
  box_count: number;
  photo_urls: string[];
  scheduled_date?: string;
  created_at: string;
}

interface OrderCardProps {
  order: OrderListResponse;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-[#E8F0FE] text-[#1742B1]";
    case "in_fulfillment":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getOrderTypeLabel = (orderType: string) => {
  switch (orderType) {
    case "self_dropoff":
      return "Self Drop-off";
    case "ready_for_pickup":
      return "Ready for Pickup";
    default:
      return orderType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderCard({ order }: OrderCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useCancelOrder();

  const handleCancelOrder = async () => {
    setIsSubmitting(true);
    mutate(
      { reason: cancelReason, orderId: order.id },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setShowCancelModal(false);
          toast.success("order cancelled");
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error("Failed to cancel order", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-[#DADCE0] mb-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            {order.status === OrderStatus.PROCESSING ? (
              <div className="space-y-2">
                <p className="text-base text-[#333333]">
                  We&#39;re ready to receive your boxes! Please bring them to
                  this address:
                </p>
                <Link
                  href="https://maps.app.goo.gl/ivcTDLRqFDXJV5Pt5"
                  className="text-[#1742B1] hover:underline font-medium"
                >
                  591 Central Ave, Brooklyn, NY 11207
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#333333]">
                    {getOrderTypeLabel(order.order_type)}
                  </h3>
                  <span
                    className={`px-3 py-1 ${getStatusColor(order.status)} text-xs font-medium rounded-full uppercase`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" strokeWidth={1.5} />
                    <span>
                      {order.box_count}{" "}
                      {order.box_count === 1 ? "box" : "boxes"}
                    </span>
                  </div>

                  {order.scheduled_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      <span>Scheduled: {formatDate(order.scheduled_date)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Created: {formatDate(order.created_at)}</span>
                  </div>
                </div>
              </>
            )}

            {order.photo_urls.length > 0 && (
              <div className="pt-2">
                <div className="flex gap-2 overflow-x-auto">
                  {order.photo_urls.slice(0, 3).map((url, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-[#DADCE0]"
                    >
                      <Image
                        src={url}
                        alt="Box photo"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                  {order.photo_urls.length > 3 && (
                    <div className="flex-shrink-0 w-16 h-16 bg-[#F5F7FA] rounded-md flex items-center justify-center border border-[#DADCE0] border-dashed">
                      <span className="text-xs text-gray-600">
                        +{order.photo_urls.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-[#F5F7FA] rounded-md transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-[#333333]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600"
                  disabled={
                    order.status === OrderStatus.COMPLETED ||
                    order.status === OrderStatus.CANCELLED
                  }
                >
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-[#F5F7FA] rounded-lg">
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Box Count:</span>{" "}
                  {order.box_count}
                </p>
                {order.scheduled_date && (
                  <p>
                    <span className="font-medium">Scheduled Date:</span>{" "}
                    {formatDate(order.scheduled_date)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason for cancellation</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please let us know why you're canceling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
              }}
              disabled={isSubmitting}
              className="px-5 py-2 bg-transparent border border-[#1742B1] text-[#1742B1] rounded-md text-sm font-medium hover:bg-[#F5F7FA] transition-all duration-200 disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isSubmitting || cancelReason === ""}
              className="px-5 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Canceling..." : "Cancel Order"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
