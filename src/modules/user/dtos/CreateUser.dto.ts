import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8),
    phoneNumber: z.string().nullable(),
    roleId: z.number().optional()
})

export type CreateUserDTO = z.infer<typeof CreateUserSchema>