import React from "react";
import { Box, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChooseMethodStepProps {
  packingMethod: "self" | "sort" | null;
  setPackingMethod: (method: "self" | "sort") => void;
}

const ChooseMethodStep: React.FC<ChooseMethodStepProps> = ({
  packingMethod,
  setPackingMethod,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        How would you like to pack your items?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={cn(
            "border rounded-lg p-6 cursor-pointer transition-all",
            packingMethod === "self"
              ? "border-gray-800 bg-purple-50"
              : "border-gray-200 hover:border-gray-600",
          )}
          onClick={() => setPackingMethod("self")}
        >
          <div className="flex items-center justify-center mb-4">
            <Box className="w-12 h-12 text-gray-800" />
          </div>
          <h4 className="text-lg font-medium text-center mb-2">
            Self Packing
          </h4>
          <p className="text-sm text-gray-600 text-center">
            We deliver boxes to you, you pack them, and we pick them up for storage.
          </p>
        </div>
        <div
          className={cn(
            "border rounded-lg p-6 cursor-pointer transition-all",
            packingMethod === "sort"
              ? "border-gray-800 bg-purple-50"
              : "border-gray-200 hover:border-gray-600",
          )}
          onClick={() => setPackingMethod("sort")}
        >
          <div className="flex items-center justify-center mb-4">
            <PackageCheck className="w-12 h-12 text-gray-800" />
          </div>
          <h4 className="text-lg font-medium text-center mb-2">
            Packed by Sort
          </h4>
          <p className="text-sm text-gray-600 text-center">
            Our team comes to your home, packs everything, and creates an inventory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseMethodStep; 