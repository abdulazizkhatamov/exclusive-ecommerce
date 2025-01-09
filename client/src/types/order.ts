import { IAddress } from "@/types/user.ts";
import { IVariant } from "@/types/variant.ts";
import { IProduct } from "@/types/product.ts";

export interface IOrderProducts {
  _id: string;
  product: IProduct; // Product ID
  variant: IVariant; // Variant ID
  quantity: number;
  price: number; // Price of the product at the time of purchase
}

export type PaymentStatus = "Pending" | "Completed" | "Failed";
export type OrderStatus =
  | "Placed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface IOrder {
  _id: string; // Order ID
  user: string; // User ID
  products: IOrderProducts[]; // Array of products in the order
  billingDetails: IAddress; // Billing details for the order
  paymentMethod: string;
  paymentStatus: PaymentStatus; // Payment status
  orderStatus: OrderStatus; // Current status of the order
  totalAmount: number; // Total amount for the order
  paymentUrl: string | null;
  createdAt: string; // Timestamp of order creation
  updatedAt: string; // Timestamp of the last update
}
