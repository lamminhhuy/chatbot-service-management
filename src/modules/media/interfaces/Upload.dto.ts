import { z } from "zod";

export const UploadDTOSchema = z.object({
    referenceType: z.string().min(1).max(255),
    referenceId: z.string().min(1).max(255),
  })
export type UploadTextPayLoadDTO = z.infer<typeof UploadDTOSchema>
export type UploadPayloadDTO = z.infer<typeof UploadDTOSchema> & { file: Express.Multer.File}