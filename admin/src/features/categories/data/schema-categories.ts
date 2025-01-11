import { z } from "zod";

// Updated Zod schema to match Mongoose Category model
export const categorySchema = z.object({
  _id: z.string(), // Mongoose ObjectId as a string
  name: z.string(),
  description: z.string().optional(), // Description is optional
  status: z.boolean(),
  parent: z.string().nullable().optional(), // Parent is either a string (ObjectId) or null
  subcategories: z.number().optional(), // Number of subcategories (name)
  products: z.number(), // Number of associated products (can be a number)
  createdAt: z.string(), // Date in string format (ISO)
  updatedAt: z.string(), // Date in string format (ISO)
});

export type Category = z.infer<typeof categorySchema>;
