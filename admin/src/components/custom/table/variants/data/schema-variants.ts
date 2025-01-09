import { z } from "zod";

// Define your schema (you already have this part)
export const variantSchema = z.object({
  _id: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number(),
  images: z.array(z.string()), // Array of strings for image URLs
  product: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export type Variant = z.infer<typeof variantSchema>;
