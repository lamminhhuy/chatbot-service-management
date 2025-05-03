import { z } from "zod";

export const UpdatePostCategoryPayloadDTO = z.object({
    name: z.string(),
    friendlySlug: z.string(),
    parentId: z.number().optional()
});

export type UpdatePostCategoryPayloadDTOType = z.infer<typeof UpdatePostCategoryPayloadDTO>;