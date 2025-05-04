import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";
import PaymentController from "../controllers/PaymentController";
import { container } from "tsyringe";
import { validateRequest, validateRequestQueryParams } from "@/shared/middlewares/validateRequest/validateRequest";
import { CreatePaymentRequestDTOSchema } from "../dtos/CreatePaymentRequest.dto";
import { CheckSuccessQueryDTOSchema } from "../dtos/CheckSuccess.dto";
import { RevenueQueryParamsSchema } from "../dtos/RevenueQueryParams.type";


const paymentController = container.resolve(PaymentController);
const PaymentModule : ModuleConfig = {
    prefix: '/payments',
    moduleName: 'payment',
    routes: [
        {
            method: 'POST',
            path: '/',
            handler: { controller: 'payment',
                action:  paymentController.createPayment.bind(paymentController)},
            middlewares: [validateRequest(CreatePaymentRequestDTOSchema)]   
        },
        {
            method: 'POST',
            path: '/update-status',
            isPublic: true,
            handler: { controller: 'payment',
                action:  paymentController.updatePaymentStatus.bind(paymentController)},
            middlewares: []
        },
        {
            method: 'GET',
            path: '/check-success',
            handler: { controller: 'payment',
                action:  paymentController.checkSuccess.bind(paymentController)},
            middlewares: [validateRequestQueryParams(CheckSuccessQueryDTOSchema)]
        },
        {
            method: 'GET',
            path: '/user',
            handler: { controller: 'payment',
                action:  paymentController.getUserPayments.bind(paymentController)},
            middlewares: []
        },
        {
            method: 'GET',
            path: '/weekly-revenue',
            handler: { controller: 'payment',
                action:  paymentController.getWeeklyRevenue.bind(paymentController)},
            middlewares: [validateRequestQueryParams(RevenueQueryParamsSchema)]
        },
        {
            method: 'GET',
            path: '/monthly-revenue',
            handler: { controller: 'payment',
                action:  paymentController.getMonthlyRevenue.bind(paymentController)},
            middlewares: [validateRequestQueryParams(RevenueQueryParamsSchema)]
        }
    ]
}

export default PaymentModule