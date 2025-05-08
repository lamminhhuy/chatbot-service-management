import { container } from "tsyringe";
import CommunicationService from "./services/CommunicationService";

export function registerCommunicationDependencies() {
    container.register(CommunicationService, { useClass: CommunicationService });
}