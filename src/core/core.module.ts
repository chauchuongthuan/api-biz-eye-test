import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from '@common/auth/auth.module';
import { FastJwtService } from './services/fastJwt.service';
import { HelperService } from './services/helper.service';
import { PermissionService } from './services/permission.service';
import { ResponseService } from './services/response.service';
import { JwtUserMiddleware } from './middlewares/jwtUser.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActivityModule } from '@common/activities/activity.module';
import { ExportService } from '@core/services/export.service';
import { FbGraphService } from '@core/services/fbGraph.service';
import * as compression from 'compression';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { SettingModule } from '@src/common/setting/setting.module';
import { ItemModule } from '@src/items/item.module';

@Global()
@Module({
   imports: [
      AuthModule,
      ActivityModule,
      SettingModule,
      ItemModule,
      ConfigModule.forRoot({
         envFilePath: ['.env'],
         load: [configuration],
         isGlobal: true,
         expandVariables: true,
      }),
      ServeStaticModule.forRoot({
         rootPath: join(__dirname, '../../'),
         serveRoot: '',
      }),
      ScheduleModule.forRoot(),
   ],

   providers: [HelperService, ResponseService, FastJwtService, PermissionService, ExportService, FbGraphService],

   exports: [HelperService, ResponseService, FastJwtService, PermissionService, ExportService, FbGraphService],
})
export class CoresModule implements NestModule {
   /**
    * Global Middleware
    * @param consumer
    */
   configure(consumer: MiddlewareConsumer): any {
      /*
       * Common middleware:
       * - Helmet: Security http headers
       * - Compression: Gzip, deflate
       * - Rate limiting
       */
      consumer.apply(compression(), LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

      /*
       * Recaptcha
       */
      // consumer.apply(ReCaptchaMiddleware)
      //     .forRoutes(
      //         // { path: 'auth/customers/login', method: RequestMethod.ALL },
      //         // { path: 'auth/customers/register', method: RequestMethod.ALL },
      //         // { path: 'auth/customers/forgot-password', method: RequestMethod.ALL },
      //         // { path: 'subscribers', method: RequestMethod.ALL },
      //     );
      // /*
      //  * End common middleware
      //  */

      // /*
      //  * JWT validate
      //  */
      consumer
         .apply(JwtUserMiddleware)
         .exclude({ path: 'auth/users/login', method: RequestMethod.ALL })
         .forRoutes(
            { path: 'admin*', method: RequestMethod.ALL },
            { path: 'auth/users/logout', method: RequestMethod.ALL },
            { path: 'auth/users/profiles', method: RequestMethod.ALL },
            { path: 'admin/category', method: RequestMethod.ALL },
         );
   }
}
