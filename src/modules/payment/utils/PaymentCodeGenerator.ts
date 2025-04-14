import { v4 as uuidv4 } from 'uuid';

class PaymentCodeGenerator {
  static generateCode(): string {
    return `SUB${uuidv4().slice(0, 5).toUpperCase()}`;
  }
}

export default PaymentCodeGenerator;