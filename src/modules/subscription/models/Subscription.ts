import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    OneToMany,
  } from 'typeorm';
  import { Check } from 'typeorm';
import { BillingCycle } from '../enums/BillingCycle';
import { UpdateSubscriptionDTO } from '../dtos/UpdateSubscription.dto';
import { formatCode } from '../utils/formatCode';
import { SubscriptionType } from '../enums/SubscriptionType';
  
@Entity('subscriptions')
@Check(`"price" >= 0`)
@Check(`"query_token_limit" IS NULL OR "query_token_limit" >= 0`)
@Check(`"billing_cycle" IN ('monthly', 'quarterly', 'yearly', 'one-time')`)
@Index('idx_subscriptions_is_active', ['isActive'])
@Index('idx_subscriptions_billing_cycle', ['billingCycle'])
@Index('idx_subscriptions_metadata_gin', { synchronize: false }) 

export class Subscription {


  @PrimaryGeneratedColumn('increment')
  id: number;
  
    @Column({ name: 'name', type: 'varchar', length: 100, unique: true, nullable: false })
    name: string;
  
    @Column({ name: 'code', type: 'varchar', length: 50, unique: true, nullable: false })
    code: string;

    @Column({ name: 'type', type: 'enum', enum: SubscriptionType, default: SubscriptionType.BASIC })
    type: SubscriptionType;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0,transformer: {
      to(value: number): number {
          return value;
      },
      from(value: string): number {
          return parseFloat(value); 
      },
  }, })
    price: number;
  @Column({ type: 'boolean', name: 'can_chat_with_agent', default: false })
    canChatWithAgent: boolean;

    @Column({ type: 'varchar', name: 'billing_cycle', length: 20 })
    billingCycle: BillingCycle;
  
    @Column({
      name: 'period_months',
      type: 'integer',
      generatedType: 'STORED',
      asExpression: `
        CASE "billing_cycle"
          WHEN 'monthly' THEN 1
          WHEN 'quarterly' THEN 3
          WHEN 'yearly' THEN 12
          WHEN 'one-time' THEN NULL
        END
      `,
    })
    periodMonths: number;
  
    @Column({ type: 'boolean', name: 'is_active', default: true })
    isActive: boolean;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;
  
    @Column({ type: 'integer', name: 'query_token_limit', nullable: true })
    queryTokenLimit: number| null;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt?: Date; 

    updateFromDTO(dto: UpdateSubscriptionDTO): void {
      this.name = dto.name;
      this.code = formatCode(dto.name);
      this.price = dto.price;
      this.description = dto.description;
      this.metadata = dto.metadata;
      this.queryTokenLimit = dto.queryTokenLimit;
      this.canChatWithAgent = dto.canChatWithAgent;
    }
    

  }
  