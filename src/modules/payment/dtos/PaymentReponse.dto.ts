import { z } from "zod";

export const PaymentResponseSchema = z.object({
    paymentId: z.string(),
    acc: z.string(),
    amount: z.number(),
    bank: z.string(),
    content: z.string()
})

export type PaymentResponseDTO = z.infer<typeof PaymentResponseSchema>