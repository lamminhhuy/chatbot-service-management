import { RevenueAggregateDTO } from "../dtos/RevenueAggrerate.dto";
import Payment from "../models/Payment";

export interface IPaymentRepository {
    save(payment: Payment): Promise<Payment>;
    findOneByCode(code: string): Promise<Payment | null>;
    getWeeklyRevenue(startDate: Date, endDate: Date): Promise<Array<RevenueAggregateDTO>>;
    getMonthlyRevenue(startDate: Date, endDate: Date): Promise<Array<RevenueAggregateDTO>>;
    getMonthlyRevenueWithGrowth(): Promise<{currentMonth: number; previousMonth: number; growthRate: number;
        total: number;
    }>;
}