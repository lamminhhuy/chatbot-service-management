import { z } from "zod";
import { BillingCycle } from "../enums/BillingCycle";

export const CreateSubscriptionDTOSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().min(0),
    description: z.string(),
    metadata: z.any().optional(),
    queryTokenLimit: z.number().nullable(),
    canChatWithAgent: z.boolean()
});

export type CreateSubscriptionDTO = z.infer<typeof CreateSubscriptionDTOSchema>;