import React from "react";
import { Separator } from "@/components/ui/separator.tsx";

interface ProductInfoProps {
  name: string;
  rating: number;
  reviews: number;
  discount: number;
  currentPrice: number;
  price: number;
  description: string;
  isOutOfStock: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  rating,
  reviews,
  discount,
  currentPrice,
  price,
  description,
  isOutOfStock,
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{name}</h1>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                i < Math.floor(rating)
                  ? "text-yellow-400"
                  : i === Math.floor(rating) && rating % 1 !== 0
                    ? "text-yellow-200"
                    : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.432 8.2 1.175-5.934 5.787 1.4 8.179L12 18.896l-7.334 3.864 1.4-8.179-5.934-5.787 8.2-1.175z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-500 text-sm">({reviews} Reviews)</span>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <span
          className={`${
            isOutOfStock ? "text-red-500" : "text-green-500"
          } font-semibold`}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      <div className="text-2xl font-semibold">
        {discount > 0 ? (
          <>
            <span className="line-through text-gray-500">${price}</span>
            <span className="text-red-500 ml-2">
              ${currentPrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span>${currentPrice.toFixed(2)}</span>
        )}
      </div>

      <p className="text-gray-600 text-sm whitespace-pre-line">{description}</p>
    </div>
  );
};

export default ProductInfo;
