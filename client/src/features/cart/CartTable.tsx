import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { ICartItem } from "@/types/user.ts";
import { useDispatch } from "react-redux";
import {
  removeCartItem,
  updateCartQuantity,
} from "@/features/auth/auth-slice.ts";
import { useMutation } from "react-query";
import {
  deleteDeleteCartItem,
  putUpdateCartItemQty,
} from "@/features/cart/requests.ts";
import { calculateSubtotal, formatPrice } from "@/features/cart/utils.ts";

interface CartTableProps {
  cartItems: ICartItem[];
}

const CartTable: React.FC<CartTableProps> = ({ cartItems }) => {
  const dispatch = useDispatch();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cartItems.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={`/${item.variant.images[0]}`}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{item.product.name}</span>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    {item.variant.attributes.map((attr, index) => (
                      <Badge key={index} variant="secondary">
                        {attr.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatPrice(
                    item.variant.price *
                      (1 - (item.product.discount || 0) / 100),
                  )}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button
                    onClick={() => updateQuantity(item._id, true)}
                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateQuantity(item._id, false)}
                    disabled={item.quantity <= 1}
                    className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <span className="w-8 text-center">
                  {String(item.quantity).padStart(2, "0")}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(calculateSubtotal(item))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CartTable;
