
import { RoleResonseDTOSchema } from "@/modules/authorization/dtos/RoleResponseDTOSchema";
import { SubscriptionResponseDTOSchema } from "@/modules/subscription/dtos/SubscriptionReponse.dto";
import { DateOrStringSchema } from "@/shared/schemas/DateOrStringSchema";
import { z } from "zod";

export const UserResponseDTOSchema = z.object({
  id: z.number(),
  email: z.string(),
  roles: z.array(RoleResonseDTOSchema),
  username: z.string(),
  phoneNumber: z.string().nullable(),
  createdAt: DateOrStringSchema,
  userSubscription: z.object({
    id: z.number(),
    endDate: z.date().nullable(),
    startDate: z.date(),
    renewalDate: z.date().nullable(),
    subscription: SubscriptionResponseDTOSchema
  })
})


export const UserResponseDTOSchemaArray = z.array(UserResponseDTOSchema)

export type UserResponseDTO = z.infer<typeof UserResponseDTOSchema>
