import { z } from "zod";
const dateQueryParam = z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return val;
  }, z.date());
export const RevenueQueryParamsSchema = z.object({
    type: z.enum(['weekly', 'monthly', 'yearly']),
    startDate: dateQueryParam,
    endDate: dateQueryParam
}).strict();

export type RevenueQueryParams = z.infer<typeof RevenueQueryParamsSchema>;