import React from "react";
import { ICartItem } from "@/types/user.ts";

interface OrderSummaryProps {
  cartItems: ICartItem[];
  calculateSubtotal: () => number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  calculateSubtotal,
}) => {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5F5F5] rounded flex items-center justify-center">
              <img
                src={item.variant.images[0] || "fallback_image_url"}
                alt={item.product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <span>
              {item.product.name} - {item.variant.sku}
            </span>
          </div>
          <span>
            ${item.variant.price} x {item.quantity}
          </span>
        </div>
      ))}
      <div className="space-y-3 py-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>${calculateSubtotal()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span>${calculateSubtotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
