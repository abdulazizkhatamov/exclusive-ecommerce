import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  image: string;
  name: string;
  oldPrice?: number;
  newPrice: number;
  rating: number;
  reviews?: number;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  oldPrice,
  newPrice,
  rating,
  reviews,
  discount,
}) => {
  return (
    <div className="relative max-w-[16.875rem] w-full h-full bg-white rounded-lg overflow-hidden group basis-auto">
      {/* Discount Badge */}
      <div className="z-50 absolute top-2 left-2 bg-primary_red text-white text-xs font-bold px-2 py-1 rounded">
        -{discount}%
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 flex justify-center">
        <Link to={`/products/${name}`} className={"flex justify-center"}>
          <img src={image} alt={name} className="object-contain p-10" />
        </Link>
        {/* Add to Cart Button (Visible on Hover) */}
        <button className="absolute inset-x-0 bottom-0 bg-black text-white text-sm font-semibold py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Add To Cart
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={"#"}>
          <h3 className="text-sm font-bold text-gray-900 truncate">{name}</h3>

          {/* Pricing */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-primary_red text-lg font-semibold">
              ${newPrice}
            </span>
            <span className="text-gray-400 line-through text-sm">
              ${oldPrice}
            </span>
          </div>

          {/* Ratings */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.432 8.2 1.175-5.934 5.787 1.4 8.179L12 18.896l-7.334 3.864 1.4-8.179-5.934-5.787 8.2-1.175z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm">({reviews})</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
