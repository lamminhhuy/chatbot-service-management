import { env } from '@/shared/infrastructure/configs/envConfig';
import { IEmailService } from '@/infrastructure/email/interfaces/IEmailService';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { injectable } from 'tsyringe';

@injectable()
export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    if (!env.EMAIL_USER || !env.EMAIL_PASSWORD) {
      throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD in environment variables');
    }

    console.log('Email user:', env.EMAIL_USER);
    console.log('Email password:', env.EMAIL_PASSWORD);

    this.transporter = this.createTransporter();
  }

  private createTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, 
      },
      debug: true,
      logger: true,
    });
  }

  async send(mailOptions: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', mailOptions.to);
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.message.includes('Unexpected socket close')) {
        console.log('Reinitializing transporter due to socket close');
        this.transporter = this.createTransporter();
        try {
          await this.transporter.sendMail(mailOptions);
          console.log('Email sent successfully after reinitializing transporter:', mailOptions.to);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw new Error(`Failed to send email after retry: ${retryError}`);
        }
      } else {
        throw new Error(`Failed to send email: ${error}`);
      }
    }
  }

}