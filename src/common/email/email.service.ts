import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
   constructor(private readonly mailerService: MailerService, private httpService: HttpService) {}

   public async sendMail(
      mailto: string | Array<string>,
      subject: string,
      template: string,
      data: Record<any, any>,
      isVerify: boolean,
   ): Promise<boolean> {
      if (isVerify && typeof mailto == 'string') {
         const arrayEmail = mailto.split(',');
         for (const i in arrayEmail) {
            if (!(await this.verifyEmail(arrayEmail[i]))) {
               return false;
            }
         }
      }

      const mailName = process.env.MAIL_NAME;
      const mailFrom = process.env.MAIL_USERNAME;
      await this.mailerService.sendMail({
         to: mailto,
         from: `"${mailName}" <${mailFrom}>`, // Senders email address
         subject: subject,
         template: template || 'index', // The `.pug` or `.hbs` extension is appended automatically.
         context: data,
      });
      return true;
   }

   public async verifyEmail(email: string): Promise<boolean> {
      const key = process.env.MAIL_KEY_VERIFY;
      const result = await this.httpService
         .get<any>(`https://api.millionverifier.com/api/v3/?api=${key}&email=${email}`)
         .toPromise();
      return result.data.resultcode == 1;
   }

   public async sendForgotPassword(data: { code: number; email: string; name: string }) {
      await this.sendMail(
         data.email,
         '[TB] Quên mật khẩu',
         'forgotPassword',
         {
            prefixUrl: process.env.NODE_URL,
            frontendUrl: process.env.FRONTEND_URL,
            name: data.name,
            code: data.code,
         },
         true,
      );
   }
}
