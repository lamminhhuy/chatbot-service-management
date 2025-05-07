import { z } from "zod";

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number(),
    totalPages: z.number(),
  });

export type PaginatedResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof PaginatedResponseSchema<T>>
>;