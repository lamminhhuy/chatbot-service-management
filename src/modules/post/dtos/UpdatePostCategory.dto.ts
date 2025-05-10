import { z } from "zod";

export const UpdatePostCategoryDTOSchema = z.object({
    name: z.string(),
    friendlySlug: z.string(),
    parentId: z.number().nullable()
});

export type UpdatePostCategoryDTOType = z.infer<typeof UpdatePostCategoryDTOSchema>;