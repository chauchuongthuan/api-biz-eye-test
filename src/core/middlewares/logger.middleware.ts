import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { SettingService } from '@src/common/setting/services/setting.service';
import { Response } from 'express';
var geoip = require('geoip-lite');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
   constructor(private settingService: SettingService) {}
   private logger = new Logger('HTTP');

   async use(req: Record<string, any>, res: Response, next: () => void): Promise<any> {
      const { ip, method, originalUrl } = req;
      // var ipTest = '115.69.128.28';
      var geo = geoip.lookup(ip);
      if (geo) {
         await this.settingService.countAccessByCountry(geo.country);
      }
      if (originalUrl.includes('/api/v1/posts/') && method == 'GET') {
         const postSlug = originalUrl.split('/').pop();
         await this.settingService.updateView(postSlug);
      }
      const userAgent = req.get('user-agent') || '';
      // if (userAgent.includes('Windows')) {
      //    await this.settingService.countAccessByWindow();
      // }
      // if (userAgent.includes('Mobile')) {
      //    await this.settingService.countAccessByMobile();
      // }
      // await this.settingService.countAccessByMonth();
      // await this.settingService.countAccess();
      // await this.settingService.countAccessByMinute();
      res.on('close', () => {
         const { statusCode } = res;
         const contentLength = res.get('content-length') || '';
         this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
      });
      return next();
   }
}
