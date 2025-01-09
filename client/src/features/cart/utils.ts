import { ICartItem } from "@/types/user.ts";

export const calculateSubtotal = (item: ICartItem) => {
  const price = item.variant.price;
  const discount = item.product.discount || 0;
  const discountedPrice = price * (1 - discount / 100);
  return discountedPrice * item.quantity;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
