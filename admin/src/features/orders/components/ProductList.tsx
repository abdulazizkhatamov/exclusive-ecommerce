import React from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { formatPrice } from "@/features/orders/utils.ts";
import { IOrderProducts } from "@/types/order.ts";

interface ProductListProps {
  products: IOrderProducts[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="overflow-y-auto mb-6">
      {products.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center gap-4 mb-4 border border-gray-200 rounded px-5 py-2"
        >
          <div className="flex gap-4">
            <img
              src={`/${item.variant.images[0]}`}
              alt={item.product.name}
              className="w-[3rem] h-[3rem] rounded-md object-cover"
            />
            <div className="flex flex-col">
              <span className="font-medium">{item.product.name}</span>
              <div className="text-sm text-muted-foreground">
                {item.variant.attributes.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="mx-1">
                    {attr.value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <span className="font-medium">Quantity: </span>
              {item.quantity}
            </div>
            <div>
              <span className="font-medium">Subtotal: </span>
              {formatPrice(item.variant.price * item.quantity)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
