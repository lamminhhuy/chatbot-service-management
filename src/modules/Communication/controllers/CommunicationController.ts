import { inject } from "tsyringe";
import { ContactDTO } from "../dtos/Contact.dto";
import { Request, Response } from "express";
import { SuccessResponse } from "@/shared/response/success.response";
import CommunicationService from "../services/CommunicationService";
import { injectable } from "tsyringe";

@injectable()
class CommunicationController {
    constructor(@inject(CommunicationService) private communicationService: CommunicationService) {
    }

    async sendEmail(req: Request<{}, {}, ContactDTO>, res: Response) {
        await this.communicationService.sendEmail(req.body);
        new SuccessResponse({
            message: "Email sent successfully"
        }).send(res);
    }
}

export default CommunicationController;
