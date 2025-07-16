import nodemailer from 'nodemailer'
export interface IEmailService {
    send(mailOptions: nodemailer.SendMailOptions): Promise<void> 
}