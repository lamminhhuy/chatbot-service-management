import { z } from "zod";

export const AssignPermissionDTOSchema = z.object({
  permissionIds: z.number().array(),
});

export const RevokePermissionDTOSchema = z.object({
  permissionIds: z.number().array(),
});
export type AssignPermissionDTO = z.infer<typeof AssignPermissionDTOSchema>;

export type RevokePermissionDTO = z.infer<typeof RevokePermissionDTOSchema>;