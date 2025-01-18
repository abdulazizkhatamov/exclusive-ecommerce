import { z } from "zod";

// Define your schema (you already have this part)
export const chatAccountSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export type ChatAccount = z.infer<typeof chatAccountSchema>;
