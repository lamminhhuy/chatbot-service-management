import { PaymentRequestDTO, SePayPaymentRequestDTO } from "../dtos/CreatePaymentRequest.dto";
import { PaymentStatus } from "../enums/PaymentStatus";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import SubscriptionService from "@/modules/subscription/services/SubscriptionService";
import { env } from "@/configs/envConfig";
import { PaymentCreationDTO } from "../dtos/PaymentCreation.dto";
import { PaymentResponseDTO } from "../dtos/PaymentReponse.dto";
import { inject, injectable } from "tsyringe";
import Payment from "../models/Payment";

@injectable()
class PaymentService {
    private readonly messageContent = 'Thanh toán gói'
    constructor(@inject('IPaymentRepository')private paymentRepository: IPaymentRepository,@inject(SubscriptionService) private subscriptionService: SubscriptionService) {}
    async createPayment(input: PaymentCreationDTO): Promise<PaymentResponseDTO> {
        const existedSubscription = await this.subscriptionService.findOne(input.subscriptionId);
        if(!existedSubscription) {
            throw new BadRequestResponseError('Subscription not found');
        }

        const payment =  Payment.create({
            userId: input.userId,
            subscriptionId: input.subscriptionId,
            amount: existedSubscription.price
        });
        const savedPayment = await this.paymentRepository.save(payment);
        
        return {
            acc: env.BANK_ACC,
            bank: env.BANK_NAME,
            amount: savedPayment.amount,
            content: this.formatContent(savedPayment._code, existedSubscription.name)
        }  
    }
   
    async updatePaymentStatus(input: SePayPaymentRequestDTO): Promise<void> {
        const payment = await this.paymentRepository.findOneByCode(input.code);
        if (!payment) {
            throw new BadRequestResponseError('Payment not found');
        }
        if(input.transferAmount !== payment.amount) {
            throw new BadRequestResponseError('Amount not match');
        }
        payment.status = PaymentStatus.COMPLETED;
        await this.paymentRepository.save(payment);
    }

    private formatContent(paymentCode: string,subscriptionName: string): string {
        return `${paymentCode}. ${this.messageContent} ${subscriptionName}`;
    }
}

export default PaymentService