import { RevenueAggrerateDTO } from "../dtos/RevenueAggrerate.dto";
import Payment from "../models/Payment";

export interface IPaymentRepository {
    save(payment: Payment): Promise<Payment>;
    findOneByCode(code: string): Promise<Payment | null>;
    getWeeklyRevenue(startDate: Date, endDate: Date): Promise<Array<RevenueAggrerateDTO>>;
    getMonthlyRevenue(startDate: Date, endDate: Date): Promise<Array<RevenueAggrerateDTO>>;
}