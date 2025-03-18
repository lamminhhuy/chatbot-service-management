import { z } from "zod";

export const  registerRequestDTO = z.object({
    email: z.string().email("invalid email").nonempty("email is required"),
    password: z.string().nonempty("password is required").length(8, "password must be at least 8 characters"),
    fullName: z.string().nonempty("name is required").length(3, "name must be at least 3 characters"),
    phoneNumber: z.string().length(10, "phone number must be 10 characters").optional()
    });

