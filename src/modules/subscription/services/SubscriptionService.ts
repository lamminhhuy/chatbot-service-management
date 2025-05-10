import { CreateSubscriptionDTO } from "../dtos/CreateSubscription.dto";
import { inject, injectable } from "tsyringe";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";
import SubscriptionFactory from "../factories/subscription.factory";
import { Subscription } from "../models/Subscription";
import {
  BadRequestResponseError,
  ConflictResponseError,
} from "@/shared/response/errors.response";
import { UpdateSubscriptionDTO } from "../dtos/UpdateSubscription.dto";
import { SubscriptionCode } from "../enums/SubscriptionCode";
import UserSubscriptionRepository from "../repositories/UserSubscriptionRepository";
import { IUserSubscriptionRepository } from "../interfaces/IUserSubscriptionRepository";

@injectable()
class SubscriptionService {
  constructor(
    @inject("ISubscriptionRepository")
    private subscriptionRepository: ISubscriptionRepository,
    @inject(SubscriptionFactory)
    private subscriptionFactory: SubscriptionFactory,
    @inject('IUserSubscriptionRepository')
    private userSubscriptionRepository: IUserSubscriptionRepository
  ) {}

  async create(payload: CreateSubscriptionDTO) {
    const subscription = await this.subscriptionFactory.create(payload);
    return this.subscriptionRepository.save(subscription);
  }

  async update(id: number, payload: UpdateSubscriptionDTO) {
    const subscription = await this.subscriptionRepository.findOneById(id);
    if (!subscription) {
      throw new BadRequestResponseError("Subscription not found");
    }

    if (payload.name !== subscription.name) {
      const isNameExist = await this.subscriptionRepository.existsByName(
        payload.name
      );
      if (isNameExist) {
        throw new ConflictResponseError("Subscription name already exists");
      }
    }

    subscription.updateFromDTO(payload);

    return this.subscriptionRepository.save(subscription);
  }

  async delete(id: number) {
    const existingById = await this.subscriptionRepository.findOneById(id);
    if (!existingById) {
      throw new BadRequestResponseError("Subscription not found");
    }

    if (existingById.code === SubscriptionCode.BASIC) {
      throw new BadRequestResponseError("Basic subscription cannot be deleted");
    }
    
    if(await this.userSubscriptionRepository.hasActiveUsersForSubscription(id)){
      throw new BadRequestResponseError("The Subscription has active users");
    }
    return this.subscriptionRepository.softDeleteSubscription(id);
  }

  async findAll() {
    return this.subscriptionRepository.find();
  }

  async findById(id: number) {
    const subscription = await this.subscriptionRepository.findOneById(id);
    if (!subscription) {
      throw new BadRequestResponseError("Subscription not found");
    }
    return subscription;
  }

  async findByCode(code: SubscriptionCode): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepository.findByCode(code);
    return subscription;
  }

  async getAllActiveSubscription(): Promise<Subscription[]> {
    return this.subscriptionRepository.getAllActiveSubscription();
  }
  
}


export default SubscriptionService;
