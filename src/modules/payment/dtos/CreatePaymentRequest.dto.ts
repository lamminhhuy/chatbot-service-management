import { z } from "zod";
import { PaymentMethod } from "../enums/PaymentMethod";
import { PaymentGateway } from "../enums/PaymentGateway";

export const CreatePaymentRequestDTOSchema = z.object({
    subscriptionId: z.number()
});

export const SePayPaymentRequestSchema = z.object({
    id: z.number(),
    gateway: z.enum(['Vietcombank']),
    transactionDate: z.date(),
    accountNumber: z.number(),
    code: z.string(),
    content: z.string(),
    transferType: z.enum(['in', 'out']),
    transferAmount: z.number(),
    accumulated: z.number(),
    subAccount: z.number().nullable(),
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER]),
    paymentGateway: z.enum([PaymentGateway.SEPAY]),
    amount: z.number(),
    currency: z.string().length(3),
});
export type SePayPaymentRequestDTO = z.infer<typeof SePayPaymentRequestSchema>;
export type PaymentRequestDTO = z.infer<typeof CreatePaymentRequestDTOSchema>;