import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/user/models/UserModel";
import { Subscription } from "./Subscription";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";



@Entity("user_subscriptions")
@Index("idx_user_subscriptions_user_id", ["userId"])
@Index("idx_user_subscriptions_subscription_id", ["subscriptionId"])
@Index("idx_user_subscriptions_status", ["status"])
@Index("idx_user_subscriptions_renewal_date", ["renewalDate"])
export class UserSubscription {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ name: "user_id", type: "bigint", nullable: false })
  userId: number;

  @Column({ name: "subscription_id", type: "bigint", nullable: false })
  subscriptionId: number;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    default: SubscriptionStatus.ACTIVE,
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @Column({ name: "start_date", type: "timestamptz", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamptz", nullable: true })
  endDate?: Date;

  @Column({ name: "renewal_date", type: "timestamptz", nullable: true })
  renewalDate?: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User,{ onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Subscription,{ onDelete: "RESTRICT" })
  @JoinColumn({ name: "subscription_id", referencedColumnName: "id" })
  subscription: Subscription;
}