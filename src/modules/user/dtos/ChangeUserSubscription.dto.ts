import { z } from "zod";

export const ChangeUserSubscriptionDTOSchema = z.object({
    subscriptionId: z.number(),
}).strict();

export type ChangeUserSubscriptionDTO = z.infer<typeof ChangeUserSubscriptionDTOSchema>