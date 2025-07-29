"use client";

import React, { useState, useCallback, memo } from "react";
import { Calendar, Clock, MoreHorizontal, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCancelOrder } from "@/hooks/order/useCancelOrder";
import { OrderStatus } from "@/types/order";

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

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-[#E8F0FE] text-[#1742B1]",
  in_fulfillment: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  self_dropoff: "Self Drop-off",
  ready_for_pickup: "Ready for Pickup",
  box_provided: "Box Provided",
};

const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const getOrderTypeLabel = (orderType: string): string => {
  return (
    ORDER_TYPE_LABELS[orderType] ||
    orderType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid date: " + error;
  }
};

const OrderCard: React.FC<OrderCardProps> = memo(({ order }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: cancelOrder } = useCancelOrder();

  const isCancellable =
    order.status !== OrderStatus.COMPLETED &&
    order.status !== OrderStatus.CANCELLED;

  const handleCancelOrder = useCallback(async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsSubmitting(true);
    cancelOrder(
      { reason: cancelReason, orderId: order.id },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setShowCancelModal(false);
          setCancelReason("");
          toast.success("Order cancelled successfully");
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error("Failed to cancel order", {
            description: error.message || "Please try again later",
          });
        },
      },
    );
  }, [cancelReason, order.id, cancelOrder]);

  const handleCloseModal = useCallback(() => {
    if (!isSubmitting) {
      setShowCancelModal(false);
      setCancelReason("");
    }
  }, [isSubmitting]);

  const handleCancelReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCancelReason(e.target.value);
    },
    [],
  );

  const boxText = order.box_count === 1 ? "box" : "boxes";

  return (
    <>
      <article
        className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-[#DADCE0] mb-4"
        aria-label={`${getOrderTypeLabel(order.order_type)} order`}
      >
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
                  className="text-[#1742B1] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View warehouse location on Google Maps"
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
                    role="status"
                    aria-label={`Order status: ${order.status}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package
                      className="w-4 h-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      {order.box_count} {boxText}
                    </span>
                  </div>

                  {order.scheduled_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar
                        className="w-4 h-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span>
                        Scheduled:{" "}
                        <time dateTime={order.scheduled_date}>
                          {formatDate(order.scheduled_date)}
                        </time>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock
                      className="w-4 h-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      Created:{" "}
                      <time dateTime={order.created_at}>
                        {formatDate(order.created_at)}
                      </time>
                    </span>
                  </div>
                </div>
              </>
            )}

            {order.photo_urls.length > 0 && (
              <div className="pt-2">
                <div
                  className="flex gap-2 overflow-x-auto"
                  role="list"
                  aria-label="Box photos"
                >
                  {order.photo_urls.slice(0, 3).map((url, index) => (
                    <div
                      key={`${order.id}-photo-${index}`}
                      className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-[#DADCE0]"
                      role="listitem"
                    >
                      <Image
                        src={url}
                        alt={`Box ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  {order.photo_urls.length > 3 && (
                    <div
                      className="flex-shrink-0 w-16 h-16 bg-[#F5F7FA] rounded-md flex items-center justify-center border border-[#DADCE0] border-dashed"
                      role="listitem"
                      aria-label={`${order.photo_urls.length - 3} more photos`}
                    >
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
                <button
                  className="p-2 hover:bg-[#F5F7FA] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
                  aria-label="Order actions menu"
                  aria-haspopup="true"
                >
                  <MoreHorizontal
                    className="w-5 h-5 text-[#333333]"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 focus:text-red-700"
                  disabled={!isCancellable}
                >
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </article>

      <Dialog open={showCancelModal} onOpenChange={handleCloseModal}>
        <DialogContent
          className="sm:max-w-md"
          aria-describedby="cancel-dialog-description"
        >
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription id="cancel-dialog-description">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-[#F5F7FA] rounded-lg">
              <dl className="text-sm space-y-1">
                <div>
                  <dt className="inline font-medium">Box Count:</dt>
                  <dd className="inline ml-1">{order.box_count}</dd>
                </div>
                {order.scheduled_date && (
                  <div>
                    <dt className="inline font-medium">Scheduled Date:</dt>
                    <dd className="inline ml-1">
                      <time dateTime={order.scheduled_date}>
                        {formatDate(order.scheduled_date)}
                      </time>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-reason">
                Reason for cancellation{" "}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please let us know why you're canceling this order..."
                value={cancelReason}
                onChange={handleCancelReasonChange}
                rows={3}
                className="resize-none"
                aria-required="true"
                aria-invalid={!cancelReason.trim() && isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-5 py-2 bg-transparent border border-[#1742B1] text-[#1742B1] rounded-md text-sm font-medium hover:bg-[#F5F7FA] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1742B1]"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isSubmitting || !cancelReason.trim()}
              className="px-5 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {isSubmitting ? "Canceling..." : "Cancel Order"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;
