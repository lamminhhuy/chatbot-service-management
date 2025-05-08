import { z } from "zod";

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: z
      .object({
        total: z.number(),
        limit: z.number(),
        offset: z.number(),
        page: z.number(),
        totalPages: z.number(),
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