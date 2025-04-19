import { z } from "zod";

export const CheckSuccessQueryDTOSchema = z.object({
    paymentId: z.string().uuid()
})