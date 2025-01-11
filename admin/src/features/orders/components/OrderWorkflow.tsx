import React from "react";

const OrderWorkflow: React.FC = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-md mb-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-2">
        Order Status Workflow:
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Track and update the status of orders. The status change triggers the
        next step in the order process.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
        <li>
          <strong>Placed:</strong> The order has been created, but payment has
          not been received.
        </li>
        <li>
          <strong>Processing:</strong> Payment has been confirmed, and the order
          is being processed.
        </li>
        <li>
          <strong>Shipped:</strong> The order has been shipped.
        </li>
        <li>
          <strong>Delivered:</strong> The order has been delivered to the
          customer, completing the order.
        </li>
      </ul>
      <p className="mt-4 text-xs text-gray-500">
        You can update the order status by clicking the "Move to" button.
      </p>
    </div>
  );
};

export default OrderWorkflow;
