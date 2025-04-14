import { container } from "tsyringe";
import PaymentRepository from "./repositories/PaymentRepository";
import PaymentService from "./services/PaymentService";

export const registerPaymentDependencies = () => {
container.register(PaymentService, {
        useClass: PaymentService,
    });
  container.register('IPaymentRepository', {
    useClass: PaymentRepository
  })
};