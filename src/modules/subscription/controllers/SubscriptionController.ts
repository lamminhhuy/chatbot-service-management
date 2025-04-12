import { Request, Response } from "express";
import SubscriptionService from "../services/SubscriptionService";
import { SuccessResponse } from "@/shared/response/success.response";
import { inject, injectable } from "tsyringe";
import { UpdateSubscriptionDTO } from "../dtos/UpdateSubscription.dto";

@injectable()
export class SubscriptionController {
    constructor(@inject(SubscriptionService) private subscriptionService: SubscriptionService) {}

    async handleGetAll(req: Request, res: Response) {
        const subscriptions = await this.subscriptionService.findAll();
        new SuccessResponse({
            message: 'Subscriptions fetched successfully!',
            data: subscriptions,
        }).send(res);
    }
    async handleCreate(req: Request, res: Response) {
        const payload = req.body;
        const subscription = await this.subscriptionService.create(payload);
        new SuccessResponse({
            message: 'Subscription created successfully!',
            data: subscription,
        }).send(res);
    }
    async handleGetOne(req: Request, res: Response) {
        const id = Number(req.params.id);
        const subscription = await this.subscriptionService.findOne(id);
        new SuccessResponse({
            message: 'Subscription fetched successfully!',
            data: subscription,
        }).send(res);
    }
    async handleUpdate(req: Request<{id: number}, {}, UpdateSubscriptionDTO>, res: Response) {
        const id = Number(req.params.id);
        const payload = req.body;
        const subscription = await this.subscriptionService.update(id, payload);
        new SuccessResponse({
            message: 'Subscription updated successfully!',
            data: subscription,
        }).send(res);
    }
    async handleDelete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.subscriptionService.delete(id);
        new SuccessResponse({
            message: 'Subscription deleted successfully!',
        }).send(res);
    }
}