import { z } from "zod";

export const chatRequestSchema = z.object({
  content: z
    .string()
    .nonempty("query is required")
    .transform((val) => val.trim()),
  metadata: z.object({}).optional(),
});

