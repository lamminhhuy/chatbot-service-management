import { RoleResonseDTOSchema } from "@/modules/role/dtos/RoleResponseDTOSchema";
import { z } from "zod";

export const UserResponseDTOSchema = z.object({
  id: z.number(),
  email: z.string(),
  roles: z.array(RoleResonseDTOSchema),
  username: z.string(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date()
})
