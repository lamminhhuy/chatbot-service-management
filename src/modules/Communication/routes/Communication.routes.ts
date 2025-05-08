
import { container } from "tsyringe";
import CommunicationController from "../controllers/CommunicationController";
import { validateRequest } from "@/shared/middlewares/validateRequest/validateRequest";
import { ContactDTOSchema } from "../dtos/Contact.dto";
import { ModuleConfig } from "@/modules/auth/interfaces/ModuleConfig";

const communicationController = container.resolve(CommunicationController);
export const communicationModule : ModuleConfig = {
    prefix: '/communication',
    moduleName: 'communication',
    routes: [
        {
            method: 'POST',
            path: '/send-email',
            handler: {controller: 'communication', action: communicationController.sendEmail.bind(communicationController)},
            isPublic: true,
            middlewares: [validateRequest(ContactDTOSchema)]
        }
    ]
}