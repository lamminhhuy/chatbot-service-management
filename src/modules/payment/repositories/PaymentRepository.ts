import { DataSource, Repository } from "typeorm";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { AppDataSource } from "@/database/PostgresDB";
import Payment from "../models/Payment";

class PaymentRepository extends Repository<Payment> implements IPaymentRepository {
    constructor() {
        super(Payment, AppDataSource.manager);
    }

    async findOneByCode(code: string): Promise<Payment | null> {
        return this.findOne({ where: { _code: code } });
    }
}

export default PaymentRepository;