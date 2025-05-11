import { EntityRepository, Repository } from "typeorm";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { AppDataSource } from "@/database/PostgresDB";
import Payment from "../models/Payment";
import { PaymentStatus } from "../enums/PaymentStatus";
import { Equal } from "typeorm";
import { RevenueAggrerateDTO } from "../dtos/RevenueAggrerate.dto";
@EntityRepository(Payment)
class PaymentRepository extends Repository<Payment> implements IPaymentRepository {
    constructor() {
        super(Payment, AppDataSource.manager);
    }

    async findOneByCode(code: string): Promise<Payment | null> {
        return this.findOne({ where: { _code: code }, relations: ['user'] });
    }
    async findByUserId(userId: number): Promise<Payment[]> {
        return this.find({ where: { user: { id: userId }, status: Equal(PaymentStatus.COMPLETED) }, relations: ['subscription'] });
    }

    async findById(id: string): Promise<Payment | null> {
        return this.findOne({ where: { id } });
    }
    async getWeeklyRevenue(startDate: Date, endDate: Date): Promise<RevenueAggrerateDTO[]> {
      return this.createQueryBuilder('payment')
        .select("DATE_TRUNC('day', payment.completed_at) as period")
        .addSelect('SUM(payment.amount)', 'amount')
        .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
        .andWhere('payment.completed_at BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        })
        .groupBy('period')
        .orderBy('period', 'ASC')
        .getRawMany();
  }
      async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<RevenueAggrerateDTO[]> {
        return this.createQueryBuilder('payment')
          .select("DATE_TRUNC('week', payment.completed_at) as period")
          .addSelect('SUM(payment.amount)', 'amount')
          .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
          .andWhere('payment.completed_at BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .groupBy('period')
          .orderBy('period', 'ASC')
          .getRawMany();
      }
      async getMonthlyRevenueWithGrowth(): Promise<{
        total: number;
        currentMonth: number;
        previousMonth: number;
        growthRate: number;
      }> {
        const now = new Date();
      
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
        const [totalResult, currentResult, previousResult] = await Promise.all([
          this.createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'amount')
            .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
            .getRawOne(),
      
          this.createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'amount')
            .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
            .andWhere('payment.completed_at BETWEEN :start AND :end', {
              start: currentMonthStart,
              end: currentMonthEnd,
            })
            .getRawOne(),
      
          this.createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'amount')
            .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
            .andWhere('payment.completed_at BETWEEN :start AND :end', {
              start: previousMonthStart,
              end: previousMonthEnd,
            })
            .getRawOne(),
        ]);
      
        const total = Number(totalResult?.amount ?? 0);
        const currentMonth = Number(currentResult?.amount ?? 0);
        const previousMonth = Number(previousResult?.amount ?? 0);
      
        const growthRate =
          previousMonth === 0
            ? currentMonth > 0 ? 100 : 0
            : ((currentMonth - previousMonth) / previousMonth) * 100;
      
        return {
          total,
          currentMonth,
          previousMonth,
          growthRate: parseFloat(growthRate.toFixed(2)),
        };
      }
}
export default PaymentRepository;