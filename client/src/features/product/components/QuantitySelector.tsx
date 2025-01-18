import React from "react";
import { setQuantity } from "@/features/product/product-slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartSheet } from "@/features/cart/cart-slice.ts";
import { ICartItem } from "@/types/user.ts";
import { IVariant } from "@/types/variant.ts";
import { IProduct } from "@/types/product.ts";
import { RootState } from "@/app/store.ts";
import { useNavigate } from "react-router-dom";

interface QuantitySelectorProps {
  product: IProduct;
  quantity: number;
  addToCart: (product: ICartItem) => void;
  isOutOfStock: boolean;
  selectedVariant: IVariant;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  product,
  quantity,
  addToCart,
  isOutOfStock,
  selectedVariant,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    dispatch(
      setQuantity(
        type === "increment" ? quantity + 1 : Math.max(quantity - 1, 1),
      ),
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      return navigate("/signin");
    }

    const productToAdd = {
      _id: "",
      product: product,
      variant: selectedVariant,
      quantity,
    };
    dispatch(toggleCartSheet());
    addToCart(productToAdd);
  };

  return (
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
        className={`px-10 py-2 text-white rounded ${
          isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
        }`}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        Buy Now
      </button>
    </div>
  );
};

export default QuantitySelector;
