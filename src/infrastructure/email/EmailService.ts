import { env } from '@/configs/envConfig'
import { IEmailService } from '@/infrastructure/email/interfaces/IEmailService';
import nodemailer from 'nodemailer'
import { injectable } from 'tsyringe';

@injectable()
export class EmailService implements IEmailService {
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
    async send(mailOptions: nodemailer.SendMailOptions): Promise<void> {
        await this.transporter.sendMail(mailOptions);
      }
}