import { IEmailService } from "@/infrastructure/email/interfaces/IEmailService";
import { inject, injectable } from "tsyringe";

@injectable()
class CommunicationService {
    constructor(@inject('IEmailService') private emailService: IEmailService) {
    }

    async sendEmail() {
        await this.emailService.sendEmail();
    }
}

export default CommunicationService;