import React from "react";
import { Link } from "react-router-dom";
import { IProduct } from "@/types/product.ts";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: IProduct | null | undefined; // Handle undefined or null product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // If product is undefined or null, return null or a placeholder (like a loading state)
  if (!product) {
    return null; // You can also return a loading spinner or placeholder component
  }

  const rating = product.rating ?? 0; // Default to 0 if no rating is provided
  const reviews = product.reviews ?? 0; // Default to 0 if no reviews are provided
  const discount = product.discount ?? 0; // Default to 0 if no discount is provided

  return (
    <div className="relative max-w-[16.875rem] w-full h-full bg-white rounded-lg overflow-hidden group basis-auto">
      {discount > 0 && (
        <div className="z-50 absolute top-2 left-2 bg-primary_red text-white text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 flex justify-center">
        <Link to={`/product/${product._id}`} className={"flex justify-center"}>
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product._id}
            className="object-contain p-10"
          />
        </Link>
        <Link to={`/product/${product._id}`}>
          <button className="absolute inset-x-0 bottom-0 bg-black text-white text-sm font-semibold py-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className={"max-w-max mx-auto"} />
          </button>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-primary_red text-lg font-semibold">
              ${product.price}
            </span>
          </div>

          {/* Ratings */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => {
                // Determine whether to fill the star with yellow or grey
                const starColor =
                  i < Math.floor(rating)
                    ? "text-yellow-400"
                    : i === Math.floor(rating) && rating % 1 !== 0
                      ? "text-yellow-200" // Partial star (half-yellow)
                      : "text-gray-300"; // Empty star

                return (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${starColor}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.432 8.2 1.175-5.934 5.787 1.4 8.179L12 18.896l-7.334 3.864 1.4-8.179-5.934-5.787 8.2-1.175z" />
                  </svg>
                );
              })}
            </div>
            <span className="text-gray-500 text-sm">({reviews})</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
