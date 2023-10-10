import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthModule } from './common/auth/auth.module';
const fs = require('fs');

import { json, urlencoded } from 'body-parser';
import { UserAuthModule } from './common/auth/user/user.module';
import { ValidationPipe } from '@nestjs/common';
const bodyParser = require('body-parser');
import { tokenDrawModule } from './common/tokenDraw/tokenDraw.module';
import { MarketingMailModule } from './common/marketingMail/marketingMail.module';
import { AwardModule } from './common/award/award.module';
import { CategoryModule } from './common/category/category.module';
import { PostModule } from './common/posts/post.module';
import { ExpertiseModule } from './common/expertise/expertise.module';
import { PageModule } from './common/page/page.module';
import { SettingModule } from './common/setting/setting.module';

async function createFileEvn() {
   const data = {
      type: 'service_account',
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_APPLICATION_CREDENTIALS_PEM.split(String.raw`\n`).join('\n'),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
   };
   console.log(`🚀data----->`, data);
   const jsonData = JSON.stringify(data);
   const filePath = './gcKey.json';
   fs.writeFileSync(filePath, jsonData);
}

createFileEvn();
async function bootstrap() {
   fs.mkdirSync(process.env.PREFIX_UPLOAD_TMP, { recursive: true });
   fs.mkdirSync(process.env.PREFIX_FILE_MANAGER, { recursive: true });
   console.log(`Create upload tmp folder: ${process.env.PREFIX_UPLOAD_TMP}`);

   const app = await NestFactory.create<NestExpressApplication>(AppModule);
   app.get(ConfigService);
   app.enableCors();

   app.use(json({ limit: '100mb' }));
   app.use(urlencoded({ limit: '100mb', extended: true }));
   app.use(bodyParser.json({ limit: '50mb' }));
   app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
   let basePath = process.env.BASE_PATH;
   if (!basePath) basePath = '/';
   if (basePath != '/' && basePath.charAt(0) != '/') basePath = '/' + basePath + '/';
   app.setGlobalPrefix(basePath + 'api/v1');
   // app.useStaticAssets(join(__dirname, '..', 'public'));

   new Swagger(app).setup(basePath);

   if (process.env.NODE_ENV !== 'production') {
      basePath = basePath.replace(/^\//g, '');
      new Swagger(app).setup(basePath);
   }

   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
      }),
   );

   await app.listen(process.env.NODE_PORT);
   console.log(`Application is running on: ${await app.getUrl()}`);
}

class Swagger {
   constructor(private app: NestExpressApplication) {}

   /**
    * Register more swagger api here
    */
   setup(basePath = ''): void {
      this.register(undefined, basePath + 'api');
   }

   register(extraModules?: any[], path?: string, title?: string, description?: string, version?: string): void {
      const mainModules = [AuthModule, AwardModule, CategoryModule, PostModule, ExpertiseModule, PageModule, SettingModule];
      if (extraModules) {
         mainModules.push(...extraModules);
      }

      const siteTitle = title || 'API Biz Eyes';
      const options = new DocumentBuilder()
         .setTitle(siteTitle)
         .setDescription('PI Biz Eyes description')
         .setVersion('1.0')
         .addBearerAuth()
         .build();

      const document = SwaggerModule.createDocument(this.app, options, {
         include: mainModules,
      });
      SwaggerModule.setup(path || 'api', this.app, document, { customSiteTitle: siteTitle });
   }
}

bootstrap();
