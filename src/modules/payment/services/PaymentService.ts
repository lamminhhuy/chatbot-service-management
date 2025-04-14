import { PaymentRequestDTO } from "../dtos/CreatePaymentRequest.dto";
import { PaymentStatus } from "../enums/PaymentStatus";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { PaymentMethod } from "@/PaymentMethod";
import { PaymentGateway } from "../enums/PaymentGateway";
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
            content: this.generateMessageContent(existedSubscription.name)
        }  
    }

    private generateMessageContent(subscriptionName: string): string {
        return `${this.messageContent} ${subscriptionName}`;
    }
}

export default PaymentService