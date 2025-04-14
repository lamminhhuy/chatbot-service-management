import Payment from "../models/Payment";

export interface IPaymentRepository {
    save(payment: Payment): Promise<Payment>;
}