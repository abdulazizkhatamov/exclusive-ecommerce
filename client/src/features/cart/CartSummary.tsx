import React from "react";
import { ICartItem } from "@/types/user.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { calculateSubtotal, formatPrice } from "@/features/cart/utils.ts";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  cartItems: ICartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartItems }) => {
  const navigate = useNavigate();
  const totalPrice = formatPrice(
    cartItems.reduce((total, item) => total + calculateSubtotal(item), 0),
  );

  const handleCheckout = async () => {
    if (!cartItems.length) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <Card className="w-full max-w-sm shadow-none  border rounded">
      <CardHeader>
        <CardTitle>Cart Total</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">{totalPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Shipping:</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="font-medium">Total:</span>
          <span className="font-medium">{totalPrice}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-red-500 hover:bg-red-600"
          onClick={handleCheckout}
        >
          Proceed to checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
