import React from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { formatPrice } from "@/features/orders/utils.ts";
import { IOrder } from "@/types/order.ts";

interface OrderDetailsProps {
  order: IOrder;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const totalQuantity = order.products.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalAmount = order.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6 mb-6">
      <div className="w-full md:w-1/2">
        <p className="text-sm font-medium text-gray-700">Order ID:</p>
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>{order._id}</p>
        </div>
        <p className="text-sm font-medium text-gray-700">Billing Details:</p>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{order.billingDetails.fullName}</p>
          <p>{order.billingDetails.street}</p>
          <p>{order.billingDetails.apartment}</p>
          <p>{order.billingDetails.city}</p>
          <p>{order.billingDetails.state}</p>
          <p>{order.billingDetails.postalCode}</p>
          <p>{order.billingDetails.phone}</p>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">User Email:</p>
          <p className="text-sm text-gray-600">{order.user.email}</p>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">Payment Method:</p>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">Payment Status:</p>
          <Badge variant="outline" className="text-gray-600">
            {order.paymentStatus}
          </Badge>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">Total Quantity:</p>
          <p className="text-sm text-gray-600">{totalQuantity}</p>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">Total Amount:</p>
          <p className="text-sm text-gray-600">{formatPrice(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
