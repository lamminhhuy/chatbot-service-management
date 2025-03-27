
import { UserResponseDTOSchema } from "@/modules/user/dtos/UserResponse.dto";
import { z } from "zod";




export const RegisterResponseDTOSchema = z.object({
    user:UserResponseDTOSchema,
    accessToken: z.string(),
});

export type RegisterResponseDTO = z.infer<typeof RegisterResponseDTOSchema>