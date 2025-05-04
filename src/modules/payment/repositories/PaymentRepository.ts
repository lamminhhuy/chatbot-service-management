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
    
      async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<RevenueAggrerateDTO[]> {
        return this.createQueryBuilder('payment')
          .select("DATE_TRUNC('month', payment.completed_at) as period")
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
}
export default PaymentRepository;