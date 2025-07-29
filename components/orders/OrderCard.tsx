"use client";

import React, { useState, useCallback, memo } from "react";
import {
  Calendar,
  Clock,
  MoreVertical,
  Package,
  MapPin,
  ChevronRight,
  X,
} from "lucide-react";
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

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  pending: {
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: "⏳",
  },
  processing: {
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: "🔄",
  },
  in_fulfillment: {
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    icon: "📦",
  },
  completed: {
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: "✅",
  },
  cancelled: {
    color: "text-gray-700",
    bg: "bg-gray-50 border-gray-200",
    icon: "❌",
  },
};

const ORDER_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  self_dropoff: {
    label: "Self Drop-off",
    icon: <Package className="w-4 h-4" />,
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  box_provided: {
    label: "Box Provided",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      </svg>
    ),
  },
};

const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.pending;
};

const getOrderTypeConfig = (orderType: string) => {
  return (
    ORDER_TYPE_CONFIG[orderType] || {
      label: orderType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      icon: <Package className="w-4 h-4" />,
    }
  );
};

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

  const statusConfig = getStatusConfig(order.status);
  const orderTypeConfig = getOrderTypeConfig(order.order_type);
  const boxText = order.box_count === 1 ? "box" : "boxes";

  return (
    <>
      <article
        className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
        aria-label={`${orderTypeConfig.label} order`}
      >
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                {orderTypeConfig.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {orderTypeConfig.label}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig.bg} ${statusConfig.color}`}
                    role="status"
                  >
                    <span>{statusConfig.icon}</span>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1).replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Order #{order.id.split("-").slice(-1)[0].toUpperCase()}
                </p>
              </div>
            </div>

            {isCancellable ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Order actions menu"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setShowCancelModal(true)}
                    className="text-red-600 focus:text-red-700"
                  >
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          {/* Processing State - Special Layout */}
          {order.status === OrderStatus.PROCESSING ? (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Ready for drop-off at our warehouse
                  </p>
                  <Link
                    href="https://maps.app.goo.gl/ivcTDLRqFDXJV5Pt5"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    591 Central Ave, Brooklyn, NY 11207
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Normal State - Details Grid */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.box_count} {boxText}
                  </p>
                </div>
              </div>

              {order.scheduled_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Scheduled</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(order.scheduled_date)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Photos Section */}
          {order.photo_urls.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {order.photo_urls.slice(0, 4).map((url, index) => (
                  <div
                    key={`${order.id}-photo-${index}`}
                    className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                    style={{ zIndex: order.photo_urls.length - index }}
                  >
                    <Image
                      src={url}
                      alt={`Box ${index + 1}`}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
                {order.photo_urls.length > 4 && (
                  <div
                    className="relative w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-white shadow-sm"
                    style={{ zIndex: 0 }}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      +{order.photo_urls.length - 4}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {order.photo_urls.length} photo
                {order.photo_urls.length !== 1 ? "s" : ""} uploaded
              </span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between h-4"></div>
        </div>
      </article>

      {/* Cancel Modal */}
      <Dialog open={showCancelModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The order will be permanently
              cancelled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Order ID</dt>
                  <dd className="font-medium text-gray-900">
                    #{order.id.split("-").slice(-1)[0].toUpperCase()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Items</dt>
                  <dd className="font-medium text-gray-900">
                    {order.box_count} {boxText}
                  </dd>
                </div>
                {order.scheduled_date && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Scheduled</dt>
                    <dd className="font-medium text-gray-900">
                      {formatDate(order.scheduled_date)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cancel-reason"
                className="text-sm font-medium text-gray-700"
              >
                Reason for cancellation <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please let us know why you're canceling this order..."
                value={cancelReason}
                onChange={handleCancelReasonChange}
                rows={3}
                className="resize-none w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isSubmitting || !cancelReason.trim()}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
