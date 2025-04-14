import { SuccessResponse } from "@/shared/response/success.response";
import { PaymentRequestDTO } from "../dtos/CreatePaymentRequest.dto";
import PaymentService from "../services/PaymentService";
import { Request, Response } from "express";
import { CustomRequest } from "@/shared/interfaces/CustomRequest";
import { inject, injectable } from "tsyringe";

@injectable()
class PaymentController {
    constructor(@inject(PaymentService) private paymentService: PaymentService) {}

    async createPayment(req: CustomRequest<{}, {}, PaymentRequestDTO>, res: Response) {
        const { subscriptionId } = req.body;
    const result = await this.paymentService.createPayment({
        userId: req.user.id,
        subscriptionId,
    });

   new SuccessResponse({
    data:result,
    message: 'Create payment successfully'
   }).send(res);
}
}

export default PaymentController;
