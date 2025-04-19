import { inject, injectable } from 'tsyringe';
import { Transactional } from 'typeorm-transactional';
import { PaymentCreationDTO } from '../dtos/PaymentCreation.dto';
import { SePayPaymentRequestDTO } from '../dtos/CreatePaymentRequest.dto';
import { BadRequestResponseError } from '@/shared/response/errors.response';
import { env } from '@/configs/envConfig';
import Payment from '../models/Payment';
import PaymentRepository from '../repositories/PaymentRepository';
import SubscriptionService from '@/modules/subscription/services/SubscriptionService';
import UserSubscriptionService from '@/modules/subscription/services/UserSubscriptionService';
import { PaymentResponseDTO } from '../dtos/PaymentReponse.dto';
import { PaymentStatus } from '../enums/PaymentStatus';

@injectable()
class PaymentService {
  private readonly messageContent = 'Thanh toán gói';

  constructor(
    @inject(SubscriptionService) private subscriptionService: SubscriptionService,
    @inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService,
    @inject(PaymentRepository) private paymentRepository: PaymentRepository
  ) {}

  @Transactional()
  async createPayment(input: PaymentCreationDTO): Promise<PaymentResponseDTO> {
    const existedSubscription = await this.subscriptionService.findById(input.subscriptionId);
    if (!existedSubscription) {
      throw new BadRequestResponseError('Subscription not found');
    }

    const payment = Payment.create({
      user: input.user,
      subscriptionId: input.subscriptionId,
      amount: existedSubscription.price,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    return {
      paymentId: savedPayment.id,
      acc: env.BANK_ACC,
      bank: env.BANK_NAME,
      amount: savedPayment.amount,
      content: this.formatContent(savedPayment._code, existedSubscription.name),
    };
  }

  @Transactional()
  async updatePaymentStatus(input: SePayPaymentRequestDTO): Promise<Payment> {
    const payment = await this.paymentRepository.findOneByCode(input.code);
    if (!payment) {
      throw new BadRequestResponseError('Payment not found');
    }

    payment.complete(input.transferAmount);
    const savedPayment = await this.paymentRepository.save(payment);

    await this.userSubscriptionService.create({
      userId: payment.user.id,
      subscriptionId: payment.subscriptionId 
    });

    return savedPayment;
  }

  private formatContent(paymentCode: string, subscriptionName: string): string {
    return `${paymentCode}. ${this.messageContent} ${subscriptionName}`;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return this.paymentRepository.findByUserId(userId);
  }

  async checkSuccess(paymentId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return false;
    }
    if ( payment.status !== PaymentStatus.COMPLETED) {
      return false;
    }
    return true;
  }

}
export default PaymentService;