import { z } from "zod";
import { UserResponseDTOSchema } from "./UserResponse.dto";

export const UpdateUserDTOSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    phoneNumber: z.string().nullable()
}).strict();

export const UpdateUserResponseDTOSchema = UserResponseDTOSchema.omit({
    userSubscription: true,
  })

export const UpdatePasswordDTOSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8)
}).strict();

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTOSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserDTOSchema>

