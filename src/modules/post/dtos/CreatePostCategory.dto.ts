import { z } from "zod";

export const CreatePostCategoryDTOSchema = z.object({
    name: z.string(),
    friendlySlug: z.string().nullable(),
    parentId: z.number().nullable()
});

export type CreatePostCategoryDTOType = z.infer<typeof CreatePostCategoryDTOSchema>;