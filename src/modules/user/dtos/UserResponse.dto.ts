import { RoleResonseDTOSchema } from "@/modules/role/dtos/RoleResponseDTOSchema";
import { SubscriptionResponseDTOSchema } from "@/modules/user_subsriptions/dtos/SubscriptionReponse.dto";
import { z } from "zod";

export const UserResponseDTOSchema = z.object({
  id: z.number(),
  email: z.string(),
  roles: z.array(RoleResonseDTOSchema),
  username: z.string(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date(),
  userSubscription: z.object({
    id: z.number(),
    endDate: z.date().nullable(),
    startDate: z.date(),
    renewalDate: z.date().nullable(),
    subscription: SubscriptionResponseDTOSchema
  })
})

