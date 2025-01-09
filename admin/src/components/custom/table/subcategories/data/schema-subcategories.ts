import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const categorySchema = z.object({
  _id: z.string(), // Mongoose ObjectId as a string
  name: z.string(),
  description: z.string().optional(), // Description is optional
  status: z.boolean(),
  parent: z.string().nullable().optional(), // Parent is either a string (ObjectId) or null
  products: z.number(), // Number of associated products (can be a number)
  createdAt: z.string(), // Date in string format (ISO)
  updatedAt: z.string(), // Date in string format (ISO)
});

export type Subcategory = z.infer<typeof categorySchema>;
