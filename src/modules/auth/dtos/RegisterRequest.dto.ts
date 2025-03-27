import { z } from "zod";

export const  RegisterRequestDTOSchema = z.object({
    otp: z.string(),
    email: z.string().email("invalid email").nonempty("email is required"),
    password: z.string().nonempty("password is required").min(8, "password must be at least 8 characters"),
    username: z.string().nonempty("name is required").min(3, "name must be at least 3 characters"),
    phoneNumber: z.string().length(10, "phone number must be 10 characters").optional()
});


export type RegisterRequestDTO = z.infer<typeof RegisterRequestDTOSchema>;