import { env } from '@/configs/envConfig'
import nodemailer from 'nodemailer'

export class EmailService {
    private transporter
    constructor (){

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASSWORD
            }
        })
    }
    async sendOTP(email: string, otp: string): Promise<void> {
        const mailOptions = {
          from: env.EMAIL_USER,
          to: email,
          subject: 'Mã OTP của bạn',
          html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Hiệu lực trong 5 phút.</p>`,
          text: `Mã OTP của bạn là: ${otp}. Hiệu lực trong 5 phút.`,
        };
    
        await this.transporter.sendMail(mailOptions);
      }
}