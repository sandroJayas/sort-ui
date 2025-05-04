import React from "react";
import { Button } from "@/components/ui/button";

interface DetailsStepProps {
  packingMethod: "self" | "sort" | null;
  boxCount: number;
  setBoxCount: (count: number) => void;
  appointmentDate: string;
  setAppointmentDate: (date: string) => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  packingMethod,
  boxCount,
  setBoxCount,
  appointmentDate,
  setAppointmentDate,
}) => {
  return (
    <div className="space-y-6">
      {packingMethod === "self" ? (
        <>
          <h3 className="text-xl font-semibold">
            How many boxes do you need?
          </h3>
          <p className="text-gray-600">
            We&#39;ll deliver these boxes to your address for you to pack.
          </p>

          <div className="flex items-center justify-center space-x-4 my-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setBoxCount(Math.max(1, boxCount - 1))}
              disabled={boxCount <= 1}
            >
              -
            </Button>
            <div className="text-4xl font-bold text-gray-800 w-16 text-center">
              {boxCount}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setBoxCount(Math.min(10, boxCount + 1))}
              disabled={boxCount >= 10}
            >
              +
            </Button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800">
              Each box is 24&#34; x 18&#34; x 18&#34; and can hold up to 30 lbs.
            </p>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold">
            Schedule a packing appointment
          </h3>
          <p className="text-gray-600">
            Select when you&#39;d like our team to come to your home.
          </p>

          <div className="space-y-4 my-6">
            <label className="block text-sm font-medium text-gray-700">
              Preferred date and time
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800">
              Our team will arrive within a 2-hour window of your selected time.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsStep; 