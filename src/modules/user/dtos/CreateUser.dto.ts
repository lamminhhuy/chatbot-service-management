import { z } from "zod";
import { UserResponseDTOSchema } from "./UserResponse.dto";

export const CreateUserDTOSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8),
    phoneNumber: z.string().nullable(),
    roleId: z.number().optional()
})

export const CreateUserResponseSchema = UserResponseDTOSchema.omit({
    userSubscription: true,
  })

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>
export type CreateUserResponseDTO = z.infer<typeof CreateUserResponseSchema>
