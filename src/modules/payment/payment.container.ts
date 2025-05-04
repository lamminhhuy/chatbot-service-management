import { container } from "tsyringe";
import PaymentRepository from "./repositories/PaymentRepository";
import PaymentService from "./services/PaymentService";
import RevenueService from "./services/RevenueService";
export const registerPaymentDependencies = () => {
container.register(PaymentService, {
        useClass: PaymentService,
    });
  container.register('IPaymentRepository', {
    useClass: PaymentRepository
  })
  container.register('RevenueService', {
    useClass: RevenueService
  })
};