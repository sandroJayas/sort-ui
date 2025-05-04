import React from "react";

interface ShippingStepProps {
  packingMethod: "self" | "sort" | null;
  user: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    phone_number: string;
  } | null;
}

const ShippingStep: React.FC<ShippingStepProps> = ({ packingMethod, user }) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Shipping Information</h3>
      <p className="text-gray-600">
        {packingMethod === "self"
          ? "Where should we deliver your empty boxes?"
          : "Where should our team meet you for packing?"}
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.first_name}
              readOnly={true}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.last_name}
              readOnly={true}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={
              user.address_line_1 + " " + (user.address_line_2 || "")
            }
            readOnly={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.city}
              readOnly={true}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={"NY"}
              readOnly={true}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={user.postal_code}
              readOnly={true}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={user.phone_number}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingStep; 