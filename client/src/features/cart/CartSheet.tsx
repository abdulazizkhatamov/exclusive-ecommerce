import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, X } from "lucide-react";
import { ICartItem } from "@/types/user";
import { removeCartItem, updateCartQuantity } from "@/features/auth/auth-slice";
import {
  deleteDeleteCartItem,
  putUpdateCartItemQty,
} from "@/features/cart/requests";
import { calculateSubtotal, formatPrice } from "@/features/cart/utils";
import { toggleCartSheet } from "@/features/cart/cart-slice.ts";
import { RootState } from "@/app/store.ts";
import { useNavigate } from "react-router-dom";

interface CartSheetProps {
  cartItems: ICartItem[];
}

const CartSheet: React.FC<CartSheetProps> = ({ cartItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartSheetOpen } = useSelector((state: RootState) => state.cart);

  const mutateUpdateCartQty = useMutation({
    mutationFn: putUpdateCartItemQty,
  });
  const mutateDeleteCartItem = useMutation({
    mutationFn: deleteDeleteCartItem,
  });

  const updateQuantity = (id: string, increment: boolean) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) {
      const newQuantity = increment
        ? item.quantity + 1
        : Math.max(1, item.quantity - 1);
      dispatch(updateCartQuantity({ id, quantity: newQuantity }));
      mutateUpdateCartQty.mutate({ id, quantity: newQuantity });
    }
  };

  const removeItem = (id: string) => {
    dispatch(removeCartItem(id));
    mutateDeleteCartItem.mutate(id);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + calculateSubtotal(item),
    0,
  );

  const handleCheckoutButton = () => {
    dispatch(toggleCartSheet());

    if (!cartItems.length) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <Sheet
      open={isCartSheetOpen}
      onOpenChange={() => dispatch(toggleCartSheet())}
    >
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow mt-4 pr-4">
          {cartItems &&
            cartItems.map((item) => (
              <div key={item._id} className="flex flex-col space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`/${item.variant.images[0]}`}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {item.variant.attributes.map((attr, index) => (
                          <Badge key={index} variant="secondary">
                            {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item._id, false)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {String(item.quantity).padStart(2, "0")}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item._id, true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatPrice(
                        item.variant.price *
                          (1 - (item.product.discount || 0) / 100),
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Subtotal: {formatPrice(calculateSubtotal(item))}
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
        </ScrollArea>
        <div className="space-y-4 mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <Button
            className="w-full bg-primary_red hover:bg-red-600"
            onClick={handleCheckoutButton}
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
