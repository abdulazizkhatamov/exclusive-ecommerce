import { z } from "zod";

const userSchema = z.object({
  _id: z.string(),
  email: z.string(),
});

// Billing Details Schema
const billingDetailsSchema = z.object({
  fullName: z.string(),
  street: z.string(),
  apartment: z.string().optional(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  _id: z.string(),
});

// Product Schema
const productSchema = z.object({
  product: z.any(),
  variant: z.any(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number(),
  _id: z.string(),
});

// Order Schema
export const orderSchema = z.object({
  _id: z.string(),
  user: userSchema,
  products: z.array(productSchema),
  billingDetails: billingDetailsSchema,
  paymentMethod: z.string().optional(),
  paymentUrl: z.string().nullable().optional(),
  paymentStatus: z.enum(["Pending", "Completed", "Failed"]).default("Pending"),
  orderStatus: z
    .enum(["Placed", "Processing", "Shipped", "Delivered", "Cancelled"])
    .default("Placed"),
  totalAmount: z.number(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

// Infer TypeScript type from Zod schema
export type SUser = z.infer<typeof userSchema>;
export type Order = z.infer<typeof orderSchema>;
