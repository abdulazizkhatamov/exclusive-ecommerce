import { z } from "zod";

// Define your schema (you already have this part)
export const mailAccountSchema = z.object({
  name: z.string(),
  key: z.string(),
});

export type MailAccount = z.infer<typeof mailAccountSchema>;
