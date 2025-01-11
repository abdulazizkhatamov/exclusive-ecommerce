import React from "react";
import { Check, Clock } from "lucide-react";
import { getCurrentStep, statuses } from "@/features/orders/utils.ts";
import { IOrder } from "@/types/order.ts";

interface OrderTimelineProps {
  order: IOrder;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const currentStep = getCurrentStep(order.orderStatus);

  return (
    <div className="mb-5 max-w-max w-full mx-auto py-14">
      <div className="relative flex justify-between items-center">
        {statuses.map((status, index) => (
          <div key={status} className="flex flex-col items-center relative">
            <div
              className={`z-50 w-8 h-8 mx-8 rounded-full border-2 flex items-center justify-center
                    ${
                      index < currentStep ||
                      (status === "Delivered" &&
                        currentStep === statuses.length - 1)
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 bg-white"
                    }
                    ${index === currentStep && status !== "Delivered" ? "bg-yellow-400 border-yellow-400" : ""}`}
            >
              {index < currentStep ||
              (status === "Delivered" &&
                currentStep === statuses.length - 1) ? (
                <Check className="h-5 w-5 text-white" />
              ) : index === currentStep && status !== "Delivered" ? (
                <Clock className="h-5 w-5 text-yellow-600" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </div>
            <div className="text-sm mt-2 font-medium">{status}</div>
            {index < statuses.length - 1 && (
              <div
                className={`absolute w-[calc(100%+2rem)] h-0.5 top-4 left-8
                      ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Explanation */}
      <div className="mt-4 text-xs text-gray-500 max-w-prose mx-auto w-full text-center">
        {order.orderStatus === "Placed" && (
          <p>
            An order has been created, but the payment has not been received
            yet. Please review the order details and follow up with the customer
            to ensure payment. You can view the invoice by clicking the link:{" "}
            {order.paymentUrl && (
              <a
                href={order.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                View Invoice
              </a>
            )}
            .
          </p>
        )}

        {order.orderStatus === "Processing" && (
          <p>
            The payment for this order has been received, and the order is now
            being processed. Please prepare the items for shipment as soon as
            possible.
          </p>
        )}

        {order.orderStatus === "Shipped" && (
          <p>
            The order has been shipped, and the customer’s products are on the
            way. Please ensure the tracking details are sent to the customer
            shortly.
          </p>
        )}

        {order.orderStatus === "Delivered" && (
          <p>
            The order has been successfully delivered to the customer. Thank you
            for completing this order.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;
