import { z } from "zod";

export const UpdateRoleDTOSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(3).max(255),
})

export type UpdateRoleDTO = z.infer<typeof UpdateRoleDTOSchema>
