import { z } from "zod";

export const AssignPermissionDTOSchema = z.object({
  roleId: z.number(),
  permissionId: z.number()
});

export type AssignPermissionDTO = z.infer<typeof AssignPermissionDTOSchema>;