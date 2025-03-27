
import { UserResponseDTOSchema } from "@/modules/user/dtos/UserResponse.dto";
import { z } from "zod";

export const LoginResDTOSchema = z.object({
    user: UserResponseDTOSchema,
    accessToken: z.string()
})

export type LoginResponseDTO = z.infer<typeof LoginResDTOSchema>

