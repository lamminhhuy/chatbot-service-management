import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PaymentGateway } from '../enums/PaymentGateway';
import { PaymentStatus } from '../enums/PaymentStatus';
import PaymentCodeGenerator from '../utils/PaymentCodeGenerator';


@Entity('payments')
@Index(['userId', 'subscriptionId'], { unique: true })
class Payment {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

  @Column({ name: 'user_id', type: 'integer' })
  public readonly userId: number;

  @Column({ name: 'subscription_id', type: 'integer' })
  public readonly subscriptionId: number;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.BANK_TRANSFER,
  })
  public readonly _paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_gateway',
    type: 'enum',
    enum: PaymentGateway,
    default: PaymentGateway.SEPAY,
  })
  public readonly _paymentGateway: PaymentGateway;

  @Column({
    name: 'transaction_id',
    type: 'integer',
    nullable: true,
    comment: 'Transaction ID from payment gateway',
  })
  public readonly _transactionId: number | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  public readonly _completedAt: Date | null;

  @Column({ name: 'failed_at', type: 'timestamp', nullable: true })
  public readonly _failedAt: Date | null;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    nullable: true,
    comment: 'Additional data, e.g., gateway response, fraud check',
  })
  public readonly _metadata: Record<string, any> | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    comment: 'Payment status, e.g., COMPLETED, FAILED',
  })
  private _status: PaymentStatus;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Amount of the payment',
  })
  public readonly amount: number;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
    comment: 'Currency code, e.g., VND',
    default: 'VND'
  })
  public readonly _currency: string;

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
  public readonly _code: string;

  private constructor(params?: {
    userId: number;
    subscriptionId: number;
    paymentMethod: PaymentMethod;
    paymentGateway: PaymentGateway;
    status: PaymentStatus;
    amount: number;
    code: string;
    transactionId?: number;
    completedAt?: Date;
    failedAt?: Date;
    metadata?: Record<string, any>;
  }) {

    this.userId = params?.userId || 0;
    this.subscriptionId = params?.subscriptionId || 0;
    this._paymentMethod = params?.paymentMethod || PaymentMethod.BANK_TRANSFER;
    this._paymentGateway = params?.paymentGateway || PaymentGateway.SEPAY;
    this._status = params?.status || PaymentStatus.PENDING;
    this.amount = params?.amount || 0;
    this._code = params?.code || '';
    this._transactionId = params?.transactionId ?? null;
    this._completedAt = params?.completedAt ?? null;
    this._failedAt = params?.failedAt ?? null;
    this._metadata = params?.metadata ?? null;
  }

  static create(params: {
    userId: number;
    subscriptionId: number;
    amount: number;
  }): Payment {
    
    const code = PaymentCodeGenerator.generateCode();
 
    return  new Payment({
      userId: params.userId,
      subscriptionId: params.subscriptionId,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentGateway: PaymentGateway.SEPAY,
      status: PaymentStatus.PENDING,
      amount: params.amount,
      code: code,
    });

  }

  get status(): PaymentStatus {
    return this._status;
  }

  set status(value: PaymentStatus) {
    this._status = value;
  }
 
}

export default Payment;
