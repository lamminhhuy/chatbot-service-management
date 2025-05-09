import { z } from "zod";

import { DateOrStringSchema } from "@/shared/schemas/DateOrStringSchema";
import { SubscriptionResponseDTOSchema } from "@/modules/subscription/dtos/SubscriptionReponse.dto";
import { RoleResonseDTOSchema } from "@/modules/authorization/dtos/RoleResponseDTOSchema";

export const UserDTOSchema = z.object({
   id: z.number(),
    email: z.string(),
    roles: z.array(RoleResonseDTOSchema),
    username: z.string(),
    phoneNumber: z.string().nullable(),
    createdAt: DateOrStringSchema,
    password: z.string(),
    userSubscription: z.object({
      id: z.number(),
      endDate: z.date().nullable(),
      startDate: z.date(),
      renewalDate: z.date().nullable(),
      subscription: SubscriptionResponseDTOSchema
    })
});

export type UserDTO = z.infer<typeof UserDTOSchema>;
