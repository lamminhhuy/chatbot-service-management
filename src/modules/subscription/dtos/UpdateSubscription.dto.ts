import { z } from "zod";
import { BillingCycle } from "../enums/BillingCycle";

export const UpdateSubscriptionDTOSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  description: z.string(),
  metadata: z.any().optional(),
  queryTokenLimit: z.number().nullable()
});

export type UpdateSubscriptionDTO = z.infer<typeof UpdateSubscriptionDTOSchema>;