import React from "react";

interface ReviewStepProps {
  packingMethod: "self" | "sort" | null;
  boxCount: number;
  appointmentDate: string;
  user: {
    address_line_1: string;
    address_line_2?: string;
    postal_code: string;
  } | null;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  packingMethod,
  boxCount,
  appointmentDate,
  user,
}) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Review Your Order</h3>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Service Type:</span>
          <span>
            {packingMethod === "self" ? "Self Packing" : "Packed by Sort"}
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
            <span>{new Date(appointmentDate).toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-medium">Shipping Address:</span>
          <span>
            {user.address_line_1 +
              (user.address_line_2 ? " " + user.address_line_2 : "") +
              ", New York, " +
              user.postal_code}
          </span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between font-bold">
            <span>Estimated Total:</span>
            <span>${packingMethod === "self" ? boxCount * 7.99 : 99.99}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Final price may vary based on actual storage duration
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-gray-800">
          By completing this order, you agree to Sort&#39;s Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep; 