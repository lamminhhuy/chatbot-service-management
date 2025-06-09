import { injectable } from "tsyringe";
import nodemailer from 'nodemailer'
import { env } from '@/configs/envConfig'

@injectable()
export class EmailService implements IEmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });
  }

  async send(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}