import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getProductById } from "@/features/product/requests";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, ShoppingCart, Truck } from "lucide-react";
import { IVariant } from "@/types/variant.ts";
import { ICartItem } from "@/types/user.ts";
import { Card } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleCartSheet } from "@/features/cart/cart-slice.ts";

interface ProductProps {
  _id: string;
  addToCart: (product: ICartItem) => void;
}

const Product: React.FC<ProductProps> = ({ _id, addToCart }) => {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProductById(_id),
  });

  useEffect(() => {
    if (product?.data?.attributes) {
      const defaultAttributes: Record<string, string> = {};
      product.data.attributes.forEach(
        (attr: { name: string; value: string[] }) => {
          if (attr.value.length > 0) {
            defaultAttributes[attr.name] = attr.value[0];
          }
        },
      );
      setSelectedAttributes(defaultAttributes);
    }
  }, [product]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !product?.data) return <div>Error loading product</div>;

  const { data } = product;
  const {
    name,
    description,
    price,
    rating,
    reviews,
    attributes,
    images,
    variants,
    discount,
  } = data;

  // Find the selected variant based on attributes
  const selectedVariant = variants?.find((variant: IVariant) =>
    variant.attributes.every(
      (attr: { name: string; value: string }) =>
        selectedAttributes[attr.name] === attr.value,
    ),
  );

  const currentPrice = selectedVariant ? selectedVariant.price : price;
  const currentImages =
    selectedVariant?.images?.length > 0 ? selectedVariant.images : images;

  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
    setCurrentImageIndex(0); // Reset image index on attribute change
    setQuantity(1);
  };

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;

  const handleAddToCart = () => {
    const productToAdd = {
      _id: "",
      product: data._id,
      variant: selectedVariant,
      quantity,
    };
    dispatch(toggleCartSheet());
    addToCart(productToAdd);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prevQuantity) => {
      if (type === "increment") {
        return prevQuantity + 1;
      } else if (type === "decrement" && prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="flex">
          <div className="space-y-4">
            {currentImages.map((img: string, index: number) => (
              <img
                key={index}
                src={`/${img}`}
                alt={`${name} - ${index}`}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                  index === currentImageIndex
                    ? "border-2 border-primary_red"
                    : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <div className="ml-6 w-full">
            <img
              src={`/${currentImages[currentImageIndex]}`}
              alt={name}
              className="w-full h-[500px] object-contain rounded-md"
            />
          </div>
        </div>

        {/* Product Info */}
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

          <p className="text-gray-600 text-sm">{description}</p>

          {attributes && (
            <div className="space-y-4">
              {attributes.map((attr: { name: string; value: string[] }) => (
                <div key={attr.name}>
                  <h3 className="font-medium mb-1">{attr.name}</h3>
                  <div className="flex space-x-2">
                    {attr.value.map((val: string) => (
                      <button
                        key={val}
                        className={`py-1 px-3 flex items-center justify-center rounded-md ${
                          selectedAttributes[attr.name] === val
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleAttributeChange(attr.name, val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 py-8">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className="px-4 py-2 bg-gray-200"
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <input
                type="text"
                className="w-12 text-center focus:outline-none"
                value={quantity}
                readOnly
              />
              <button
                className="px-4 py-2 bg-gray-200"
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>
            <button
              className={`p-2 text-white rounded-full ${
                isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart />
            </button>
            <button
              className={`px-10 py-2 text-white rounded ${
                isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              Buy Now
            </button>
          </div>

          {/* Delivery Info */}
          <Card className="divide-y max-w-max py-2 px-6">
            <div className="flex items-start p-4 space-x-4">
              <Truck className="w-6 h-6" />
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <Link
                  to="#"
                  className="text-sm text-black underline font-medium"
                >
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
                  <Link to="#" className=" underline">
                    Details
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Product;
