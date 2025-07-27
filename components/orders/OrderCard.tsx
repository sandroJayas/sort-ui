"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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
    <Card className="w-full hover:shadow-md transition-shadow duration-200 mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {order.status === OrderStatus.PROCESSING ? (
                <>
                  <p>
                    We&#39;re ready to receive your boxes! please, bring them to
                    this address:
                  </p>
                  <br />
                  <Link href={"https://maps.app.goo.gl/ivcTDLRqFDXJV5Pt5"}>
                    591 Central Ave, Brooklyn, NY 11207
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">
                    {getOrderTypeLabel(order.order_type)}
                  </h3>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
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
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {order.box_count} {order.box_count === 1 ? "Box" : "Boxes"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {order.scheduled_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Scheduled:</span>{" "}
                {formatDate(order.scheduled_date)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Created:</span>{" "}
              {formatDate(order.created_at)}
            </span>
          </div>
        </div>

        {order.photo_urls.length > 0 && (
          <div className="pt-2">
            <div className="flex gap-2 overflow-x-auto">
              {order.photo_urls.slice(0, 3).map((url, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border"
                >
                  <Image src={url} alt={"image"} width={100} height={100} />
                </div>
              ))}
              {order.photo_urls.length > 3 && (
                <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center border border-dashed">
                  <span className="text-xs text-muted-foreground">
                    +{order.photo_urls.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
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
            <div className="p-4 bg-gray-50 rounded-lg">
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
              <Label htmlFor="cancel-reason">
                Reason for cancellation (optional)
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please let us know why you're canceling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
              }}
              disabled={isSubmitting}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Canceling..." : "Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
