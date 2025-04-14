import { v4 as uuidv4 } from 'uuid';

class PaymentCodeGenerator {
   static generateCode(): string {
    return uuidv4().slice(0, 8).toUpperCase();

   }
}

export default PaymentCodeGenerator;
