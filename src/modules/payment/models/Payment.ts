import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PaymentGateway } from '../enums/PaymentGateway';
import { PaymentStatus } from '../enums/PaymentStatus';
import PaymentCodeGenerator from '../utils/PaymentCodeGenerator';
import { formatPaymentAmount } from '../utils/formatPaymentAmount';
import { DomainError } from '@/shared/response/errors.response';
import { User } from '@/modules/user/models/UserModel';
import { Subscription } from '@/modules/subscription/models/Subscription';

@Entity('payments')
class Payment {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ManyToOne(() => User,{cascade: true,eager: true ,nullable:false})
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_payment_user',
  })
  public user: User;
  @ManyToOne(() => Subscription, {cascade: true,eager: true })
  @JoinColumn({
    name: 'subscription_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_payment_subscription',
  })
  public subscription: Subscription;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.BANK_TRANSFER,
  })
  public _paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_gateway',
    type: 'enum',
    enum: PaymentGateway,
    default: PaymentGateway.SEPAY,
  })
  public _paymentGateway: PaymentGateway;

  @Column({
    name: 'transaction_id',
    type: 'integer',
    nullable: true,
    comment: 'Transaction ID from payment gateway',
  })
  public _transactionId: number | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  public _completedAt: Date | null;

  @Column({ name: 'failed_at', type: 'timestamp', nullable: true })
  public _failedAt: Date | null;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    nullable: true,
    comment: 'Additional data, e.g., gateway response, fraud check',
  })
  public _metadata: Record<string, any> | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    comment: 'Payment status, e.g., COMPLETED, FAILED',
  })
  public status: PaymentStatus;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Amount of the payment',
  })
  private _amount: number;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
    comment: 'Currency code, e.g., VND',
    default: 'VND',
  })
  public _currency: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 15,
    comment: 'Payment code',
  })
  public _code: string;

  private constructor() {}

  static create(params: {
    user: User;
    subscription: Subscription;
    amount: number;
  }): Payment {
    const payment = new Payment();
    payment.user = params.user;
    payment.subscription = params.subscription;
    payment._paymentMethod = PaymentMethod.BANK_TRANSFER;
    payment._paymentGateway = PaymentGateway.SEPAY;
    payment.status = PaymentStatus.PENDING;
    payment._amount = params.amount;
    payment._code = PaymentCodeGenerator.generateCode();
    payment._transactionId = null;
    payment._completedAt = null;
    payment._failedAt = null;
    payment._metadata = null;
    payment._currency = 'VND';
    return payment;
  }


  get amount(): number {
    return formatPaymentAmount(this._amount);
  }

  public complete(transferAmount: number): void {
    if (transferAmount !== this.amount) {
      throw new DomainError('Amount not match');
    }
    if (this.status !== PaymentStatus.PENDING) {
      throw new DomainError('Payment is not pending');
    }
    this.status = PaymentStatus.COMPLETED;
    this._completedAt = new Date();
  }
}

export default Payment;
