import { z } from "zod";
import { PostCategoryResponseDTOSchema } from "./PostCategory.dto";

export const PostResponseDTOSchema = z.object({
    id: z.number(),
    title: z.string(),
    media: z.object({
        id: z.string(),
        fileUrl: z.string(),
        mediaType: z.string(),
        referenceType: z.string(),
        referenceId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date()
    }).nullable(),
    category: PostCategoryResponseDTOSchema,
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const PostResponseDTOsSchema = z.array(PostResponseDTOSchema).min(0);

export const PostResponseDTOsSchemaWithPagination =z.object({
    data: PostResponseDTOsSchema,
    meta: z.object({
        total: z.number(),
        limit: z.number(),
        offset: z.number(),
        pages: z.number()
    })
})

export type PostResponseDTOs = z.infer<typeof PostResponseDTOsSchema>;