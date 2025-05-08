import { z } from "zod";

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: z
      .object({
        total: z.number().int().nonnegative(),
        limit: z.number().int().positive(),
        offset: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        totalPages: z.number().int().positive(),
      })
      .passthrough()
  });

  export type PaginatedResponse<T> = {
    items: T[];
    meta: {
      total: number;
      limit: number;
      offset: number;
      page: number;
    totalPages: number;
    [key: string]: any;
  };
}