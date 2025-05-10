import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/user/models/UserModel";
import { SubscriptionStatus } from "@/modules/subscription/enums/SubscriptionStatus";
import { Subscription } from "@/modules/subscription/models/Subscription";



@Entity("user_subscriptions")
@Index("idx_user_subscriptions_user_id", ["userId"])
@Index("idx_user_subscriptions_status", ["status"])
@Index("idx_user_subscriptions_renewal_date", ["renewalDate"])
export class UserSubscription {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: "user_id", type: "integer", nullable: false })
  userId: number;
  
  @Column({ name: "subscription_id", type: "integer", nullable: false }) 
  subscriptionId: number;
  @ManyToOne(() => Subscription,{ onDelete: "RESTRICT", eager:true, cascade: true })
  @JoinColumn({ name: "subscription_id", referencedColumnName: "id" })
  subscription: Subscription;

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

  @ManyToOne(() => User,{ onDelete: "CASCADE", cascade: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;


}