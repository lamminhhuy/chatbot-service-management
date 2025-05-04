import { z } from "zod";

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const PermissionsResponseDTOSchema = z
  .array(PermissionSchema)
  .transform((permissions) => {
    const grouped = permissions.reduce((acc, perm) => {
      const [rawGroup] = perm.code.split(".");
      const group = rawGroup.charAt(0).toUpperCase() + rawGroup.slice(1);
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    }, {} as Record<string, typeof permissions>);
    return grouped;
  });
