import { z } from "zod";

export const PostCategoryResponseDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    friendlySlug: z.string(),
    parentId: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type PostCategoryDTO = z.infer<typeof PostCategoryResponseDTOSchema>;