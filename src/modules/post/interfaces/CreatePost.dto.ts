import { z } from "zod";

export const CreatePostDTOSchema = z.object({
    title: z.string(),
    content: z.string(),
    mediaId: z.string()
});

export type CreatePostPayloadDTO = z.infer<typeof CreatePostDTOSchema>;

