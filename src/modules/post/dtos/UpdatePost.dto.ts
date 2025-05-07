import { z } from "zod";

export const UpdatePostDTOSchema = z.object({
    title: z.string(),
    content: z.string(),
    mediaId: z.string(),
    categoryId: z.number(),
    shortDescription: z.string()
});

export type UpdatePostPayloadDTO = z.infer<typeof UpdatePostDTOSchema>;

