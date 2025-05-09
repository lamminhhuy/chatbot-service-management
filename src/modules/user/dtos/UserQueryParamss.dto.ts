import { BaseQueryParamsSchema } from "@/shared/schemas/BaseQueryParamsSchema";
import { z } from "zod";

export const UserQueryParamsDTOSchema = BaseQueryParamsSchema.extend({
    
})

export type UserQueryParamsDTO = z.infer<typeof UserQueryParamsDTOSchema>