import { Z } from "vitest/dist/chunks/reporters.D7Jzd9GS";
import { z } from "zod";

export const LoginRequestDTOSchema = z.object({
    email: z.string().email("invalid email").nonempty("email is required"),
    password: z.string().nonempty("password is required").min(8, "password must be at least 8 characters")
})

export type LoginReqDTO = z.infer<typeof LoginRequestDTOSchema>

