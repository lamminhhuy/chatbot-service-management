import { z } from "zod";

export const SubscriptionResponseDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    price: z.number(),
    billingCycle: z.string(),
    periodMonths: z.number(),
    isActive: z.boolean(),
    description: z.string(),
    metadata: z.record(z.string(), z.any()).nullable(),
    queryTokenLimit: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});

export type SubscriptionResponseDTO = z.infer<typeof SubscriptionResponseDTOSchema>;
    