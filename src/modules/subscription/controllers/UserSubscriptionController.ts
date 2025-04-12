import { Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import { inject, injectable } from "tsyringe";
import { UpdateSubscriptionDTO } from "../dtos/UpdateSubscription.dto";
import UserSubscriptionService from "../services/UserSubscriptionService";

@injectable()
export class UserSubscriptionController {
    constructor(@inject(UserSubscriptionService) private userSubscriptionService: UserSubscriptionService) {}

    async handleCreate(req: Request, res: Response) {
        const payload = req.body;
        const subscription = await this.userSubscriptionService.create(payload);
        new SuccessResponse({
            message: 'Subscription created successfully!',
            data: subscription,
        }).send(res);
    }
 
}