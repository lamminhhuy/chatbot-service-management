import { z } from "zod";
import { BillingCycle } from "../enums/BillingCycle";

export const CreateSubscriptionDTOSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().min(0),
    billingCycle: z.nativeEnum(BillingCycle),
    description: z.string(),
    metadata: z.any().optional(),
    queryTokenLimit: z.number()
});

export type CreateSubscriptionDTO = z.infer<typeof CreateSubscriptionDTOSchema>;