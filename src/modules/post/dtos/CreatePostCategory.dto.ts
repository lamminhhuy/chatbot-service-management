import { z } from "zod";

export const CreatePostCategoryPayloadDTO = z.object({
    name: z.string(),
    friendlySlug: z.string(),
    parentId: z.number().nullable()
});

export type CreatePostCategoryPayloadDTOType = z.infer<typeof CreatePostCategoryPayloadDTO>;