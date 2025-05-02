import { EntityRepository, Repository } from "typeorm";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { AppDataSource } from "@/database/PostgresDB";
import Payment from "../models/Payment";
import { PaymentStatus } from "../enums/PaymentStatus";
import { Equal } from "typeorm";
@EntityRepository(Payment)
class PaymentRepository extends Repository<Payment> implements IPaymentRepository {
    constructor() {
        super(Payment, AppDataSource.manager);
    }

    async findOneByCode(code: string): Promise<Payment | null> {
        return this.findOne({ where: { _code: code }, relations: ['user'] });
    }
    async findByUserId(userId: number): Promise<Payment[]> {
        return this.find({ where: { user: { id: userId }, status: Equal(PaymentStatus.COMPLETED) }});
    }

    async findById(id: string): Promise<Payment | null> {
        return this.findOne({ where: { id } });
    }
}
export default PaymentRepository;