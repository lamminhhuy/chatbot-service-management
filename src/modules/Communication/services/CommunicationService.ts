import { IEmailService } from "@/infrastructure/email/interfaces/IEmailService";
import { inject, injectable } from "tsyringe";
import { ContactDTO } from "../dtos/Contact.dto";
import { env } from "@/configs/envConfig";

@injectable()
class CommunicationService {
  constructor(@inject("IEmailService") private emailService: IEmailService) {}

  async sendEmail(contact: ContactDTO): Promise<void> {
    try {
      const mailOptions = {
        from: `"${contact.name}" <${env.EMAIL_USER}>`,
        replyTo: contact.email,
        to: env.EMAIL_USER,
        subject: `DƯƠNG MINH LOGISTIC`,
        text: `
          Tên: ${contact.name}
          Email: ${contact.email}
          Số điện thoại: ${contact.phone}
          Tin nhắn: ${contact.message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="color: #333;">THÔNG BÁO TỪ KHÁCH HÀNG</h3>
            <p><strong>Tên:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Số điện thoại:</strong> ${contact.phone}</p>
            <p><strong>Tin nhắn:</strong> ${contact.message}</p>
            <hr style="border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        `,
      };

      await this.emailService.send(mailOptions);
    } catch (error) {
      throw Error(`Failed to send email: ${error}`);
    }
  }
}

export default CommunicationService;