import { z } from "zod";

const RemoveRoleDTOSchema = z.object({
  roleId: z.number(),
  userId: z.number()
});

export type RemoveRoleDTO = z.infer<typeof RemoveRoleDTOSchema>;