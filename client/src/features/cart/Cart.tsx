import React from "react";
import CartTable from "@/features/cart/CartTable.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import CartSummary from "@/features/cart/CartSummary.tsx";

const Cart: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-3/4">
        {user?.cart && user.cart.length > 0 ? (
          <CartTable cartItems={user.cart} />
        ) : (
          <div className={"text-center font-inter my-5"}>Nothing found</div>
        )}
      </div>
      <div className="w-full lg:w-1/4">
        <CartSummary cartItems={user?.cart || []} />
      </div>
    </div>
  );
};

export default Cart;
