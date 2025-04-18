import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/user/models/UserModel";
import { SubscriptionStatus } from "@/modules/subscription/enums/SubscriptionStatus";
import { Subscription } from "@/modules/subscription/models/Subscription";



@Entity("user_subscriptions")
@Index("idx_user_subscriptions_user_id", ["userId"])
@Index("idx_user_subscriptions_subscription_id", ["subscriptionId"])
@Index("idx_user_subscriptions_status", ["status"])
@Index("idx_user_subscriptions_renewal_date", ["renewalDate"])
export class UserSubscription {
  
  constructor(params?: { userId: number; subscriptionId: number; endDate: Date | null; renewalDate: Date | null }) {
    this.userId = params?.userId || 0;
    this.subscriptionId = params?.subscriptionId || 0;
    this.endDate = params?.endDate || null;
    this.renewalDate = params?.renewalDate || null;
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: "user_id", type: "integer", nullable: false })
  userId: number;

  @Column({ name: "subscription_id", type: "integer", nullable: false, default: '1' })
  subscriptionId: number;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    default: SubscriptionStatus.ACTIVE,
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @Column({ name: "start_date", type: "timestamptz",  nullable: false, default: () => "CURRENT_TIMESTAMP" })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamptz", nullable: true })
  endDate: Date | null;

  @Column({ name: "renewal_date", type: "timestamptz", nullable: true })
  renewalDate: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User,{ onDelete: "RESTRICT", cascade: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Subscription,{ onDelete: "RESTRICT", eager:true, cascade: true })
  @JoinColumn({ name: "subscription_id", referencedColumnName: "id" })
  subscription: Subscription;
}