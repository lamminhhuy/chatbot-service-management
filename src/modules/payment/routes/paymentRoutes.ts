import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PaymentController from "../controllers/PaymentController";
import { container } from "tsyringe";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { CreatePaymentRequestDTOSchema } from "../dtos/CreatePaymentRequest.dto";


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
            handler: paymentController.updatePaymentStatus.bind(paymentController),
            middlewares: []
        }
    ]
}

export default PaymentModule