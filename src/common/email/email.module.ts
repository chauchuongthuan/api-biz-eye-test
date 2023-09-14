import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
   imports: [
      HttpModule.register({
         maxRedirects: 10,
      }),
      MailerModule.forRootAsync({
         imports: [],
         inject: [],
         useFactory: () => ({
            transport: {
               host: process.env.MAIL_HOST,
               port: parseInt(process.env.MAIL_PORT),
               secure: true, // true for 465, false for other ports
               auth: {
                  user: process.env.MAIL_USERNAME, // generated ethereal user
                  pass: process.env.MAIL_PASSWORD, // generated ethereal password
               },
            },
            defaults: {
               from: '"Digitop" <postmaster@mg.digitop.vn>', // outgoing email ID
            },
            template: {
               dir: process.cwd() + '/src/common/email/templates/',
               adapter: new HandlebarsAdapter(), // or new PugAdapter()
               options: {
                  strict: true,
               },
            },
         }),
      }),
   ],
   providers: [EmailService],
   controllers: [EmailController],
   exports: [EmailService],
})
export class EmailModule {}
