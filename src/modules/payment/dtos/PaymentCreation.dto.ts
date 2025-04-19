import { User } from "@/modules/user/models/UserModel";

export interface PaymentCreationDTO {
    user: User;
    subscriptionId: number;
}