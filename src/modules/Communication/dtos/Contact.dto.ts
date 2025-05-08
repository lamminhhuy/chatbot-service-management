import { z } from "zod";

export const ContactDTOSchema = z.object({
    name: z.string(),
    email: z.string(),
    message: z.string(),
    phone: z.string().optional(),
})

export type ContactDTO = z.infer<typeof ContactDTOSchema>
