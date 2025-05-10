import { DeleteResult } from "typeorm";
import { Subscription } from "../models/Subscription";
import { SubscriptionCode } from "@/modules/subscription/enums/SubscriptionCode";

export interface ISubscriptionRepository  {
    existsByName(name: string): Promise<boolean>;
    existsById(id: number): Promise<boolean>;
    save(subscription: Subscription): Promise<Subscription>;
    find(): Promise<Subscription[]>;
    findOneById(id: number): Promise<Subscription | null>;
    delete(id: number): Promise<DeleteResult>;
    softDeleteSubscription(id: number): Promise<DeleteResult>;
    getAllActiveSubscription(): Promise<Subscription[]>;
    findByCode(code: SubscriptionCode): Promise<Subscription | null>;
}
