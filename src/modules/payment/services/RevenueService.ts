import { injectable, inject } from 'tsyringe';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { format } from 'date-fns';
import { IPaymentRepository } from '../interfaces/IPaymentRepository';

interface RevenueResponse {
    total: number;
    breakdown: Array<{
      period: string;
      amount: number;
    }>;
  }

@injectable()
class RevenueService {
  constructor(
    @inject('IPaymentRepository') private paymentRepository: IPaymentRepository,
  ) {}

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate > endDate) {
      throw new BadRequestResponseError('startDate must be before endDate');
    }
  }

  async getWeeklyRevenue(startDate: Date, endDate: Date): Promise<RevenueResponse> {
    this.validateDateRange(startDate, endDate);

    const payments = await this.paymentRepository.getWeeklyRevenue(startDate, endDate);

    const breakdown = payments.map((p) => ({
      period: format(new Date(p.period), 'yyyy-MM-dd'),
      amount: parseFloat(p.amount),
    }));

    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    return { total, breakdown };
  }

  async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<RevenueResponse> {
    this.validateDateRange(startDate, endDate);

    const payments = await this.paymentRepository.getMonthlyRevenue(startDate, endDate);

    const breakdown = payments.map((p) => ({
      period: format(new Date(p.period), 'yyyy-MM'),
      amount: parseFloat(p.amount),
    }));

    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    return { total, breakdown };
  }
}

export default RevenueService;
