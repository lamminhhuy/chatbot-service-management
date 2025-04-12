import { z } from "zod";

export const SubscriptionResponseDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    price: z.number(),
    billing_cycle: z.string(),
    period_months: z.number(),
    is_active: z.boolean(),
    description: z.string(),
    metadata: z.record(z.string(), z.any()),
    query_token_limit: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
});

export type SubscriptionResponseDTO = z.infer<typeof SubscriptionResponseDTOSchema>;
    