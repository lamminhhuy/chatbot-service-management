import { z } from "zod";
export const BaseQueryParamsSchema = z
  .object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().min(1))
      .optional(),
    offset: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().min(0))
      .optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default("10")
      .pipe(z.number().min(1)),
    search: z.string().optional(),
    sort: z.enum(["title", "createdAt", "updatedAt"]).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
  })