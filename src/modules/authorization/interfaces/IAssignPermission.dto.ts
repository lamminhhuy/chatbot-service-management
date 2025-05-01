import { z } from "zod";

export const assignPermissionDTOSchema = z.object({
  permissionIds: z.number().array()
});

export type AssignPermissionPayload = z.infer<typeof assignPermissionDTOSchema>;

export const assignPermissionParamsDTOSchema = z.object({
  roleId: z.number()
});

export type AssignPermissionParamsDTO = z.infer<typeof assignPermissionParamsDTOSchema>;