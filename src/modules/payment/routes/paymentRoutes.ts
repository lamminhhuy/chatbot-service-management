import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PaymentController from "../controllers/PaymentController";
import { container } from "tsyringe";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import { CreatePaymentRequestDTOSchema } from "../dtos/CreatePaymentRequest.dto";
import { CheckSuccessQueryDTOSchema } from "../dtos/CheckSuccess.dto";


const paymentController = container.resolve(PaymentController);
const PaymentModule : ModuleConfig = {
    prefix: '/payments',
    routes: [
        {
            method: 'post',
            path: '/',
            handler: paymentController.createPayment.bind(paymentController),
            middlewares: [validateRequest(CreatePaymentRequestDTOSchema)]   
        },
        {
            method: 'post',
            path: '/update-status',
            isPublic: true,
            handler: paymentController.updatePaymentStatus.bind(paymentController),
            middlewares: []
        },
        {
            method: 'get',
            path: '/check-success',
            handler: paymentController.checkSuccess.bind(paymentController),
            middlewares: [validateRequestQueryParams(CheckSuccessQueryDTOSchema)]
        }
    ]
}

export default PaymentModule