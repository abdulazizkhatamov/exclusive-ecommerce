import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  subcategoryCount: z.number(),
  productCount: z.number(),
  createdAt: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
