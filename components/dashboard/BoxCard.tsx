"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShipmentTracker from "@/components/dashboard/ShipmentTracker";

const BoxCard = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-10">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              BOX ORDER PLACED
            </div>
            <div>April 18, 2025</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">TYPE</div>
            <div>Self Packing</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              SHIP TO
            </div>
            <div className="flex items-center">Sandro Jayasinghe</div>
            <div className="flex items-center">Viale lombardia 9, 20092</div>
            <div className="flex items-center">Cinisello Balsamo, Italy</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              TOTAL
            </div>
            <div>$78.50</div>
          </div>
        </div>

        <div className=" md:flex-row justify-between items-start md:items-center mt-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <ShipmentTracker
              currentStatus="transit"
              trackingNumber="TRK987654321"
              estimatedDelivery="April 24, 2025"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex gap-4 w-full">
              <div className="mb-2">
                <div className="font-medium">Box Name</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  In this box i have:
                  <br />
                  Put some description here
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-grow w-full">
              <Button>Mark as Received</Button>
              <Button variant="outline">Edit Box</Button>
              <Button variant="outline">Add pictures</Button>
              <Button variant="outline">Get box support</Button>
              <Button variant="outline">Return Box</Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            Cancel Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxCard;
