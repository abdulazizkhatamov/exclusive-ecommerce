import React from "react";
import { RotateCcw, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card.tsx";

const DeliveryInfo: React.FC = () => {
  return (
    <Card className="divide-y max-w-max py-4 px-6">
      <div className="flex items-start p-4 space-x-4">
        <Truck className="w-6 h-6" />
        <div>
          <h3 className="font-medium">Free Delivery</h3>
          <Link to="#" className="text-sm text-black underline font-medium">
            Enter your postal code for Delivery Availability
          </Link>
        </div>
      </div>
      <div className="flex items-start p-4 space-x-4">
        <RotateCcw className="w-6 h-6" />
        <div>
          <h3 className="font-medium">Return Delivery</h3>
          <p className="text-sm text-black font-medium">
            Free 30 Days Delivery Returns.{" "}
            <Link to="#" className="underline">
              Details
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DeliveryInfo;
