import { z } from "zod";

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
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const PostResponseDTOsSchema = z.array(PostResponseDTOSchema).min(0);

export type PostResponseDTO = z.infer<typeof PostResponseDTOSchema>;

export type PostResponseDTOs = z.infer<typeof PostResponseDTOsSchema>;