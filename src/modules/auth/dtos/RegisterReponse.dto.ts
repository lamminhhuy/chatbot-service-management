import { z } from "zod";

const roleSchema = z.object({
    id: z.number().min(1, "Role ID is required"),
    name: z.string().min(1, "Role name is required"),
    description: z.string().nullable(), 
  });

export const  registerResponseDTO = z.object({
    id: z.number().min(1, "ID is required"),
    email: z.string().email("Invalid email"),
    role: roleSchema,
    username: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().length(10, "Phone number must be 10 characters").optional(),
    createdAt: z.date()
});