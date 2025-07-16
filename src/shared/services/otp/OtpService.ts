import { env } from "@/shared/infrastructure/configs/envConfig";
import { generateOTP } from "../../utils/generateOTP";
import { IEmailService } from "@/infrastructure/email/interfaces/IEmailService";
import  OtpProvider from "@/infrastructure/cache/CacheProvider";
import { inject, injectable } from "tsyringe";
import { BadRequestResponseError } from "@/shared/response/errors.response";
import { IOtpService } from "./OtpService.type";

@injectable()
export class OtpService implements IOtpService {
    constructor(@inject('IEmailService') private emailService: IEmailService,@inject('ICacheProvider') private  otpProvider: OtpProvider<string>) {}
    async sendOtp(email: string): Promise<void> {
        const otp = generateOTP()
        await this.otpProvider.setEx(email, otp, env.OTP_EXPIRATION_TIME)
        const mailOptions = {
            from: env.EMAIL_USER,
            to: email,
            subject: 'Mã OTP của bạn',
            html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Hiệu lực trong 5 phút.</p>`,
            text: `Mã OTP của bạn là: ${otp}. Hiệu lực trong 5 phút.`,
          }
          this.emailService.send(mailOptions)
    }
    async verifyOtp(email: string, otp: string): Promise<void> {
        const storedOTP = await this.otpProvider.get(email)
        if (!storedOTP || storedOTP !== otp) {
          throw new BadRequestResponseError('OTP is not valid or expired!')
        }
        await this.otpProvider.delete(email)
      }
}
