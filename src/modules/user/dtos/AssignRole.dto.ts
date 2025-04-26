import { z } from "zod";

export const AssignRoleDTOSchema = z.object({
  roleId: z.number(),
  userId: z.number()
});

export type AssignRoleDTO = z.infer<typeof AssignRoleDTOSchema>;