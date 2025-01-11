import { z } from "zod";

// Define your schema (you already have this part)
export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  images: z.array(z.string()), // Array of strings for image URLs
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export type Product = z.infer<typeof productSchema>;
