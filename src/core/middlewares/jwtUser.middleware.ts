import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { GuardEnum } from '../constants/guard.enum';
import { UserAuthService } from '@common/auth/user/services/auth.service';
import { HelperService } from '../services/helper.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtUserMiddleware implements NestMiddleware {
   constructor(
      private readonly authService: UserAuthService,
      private readonly helperService: HelperService,
      private readonly configService: ConfigService,
   ) {}

   async use(req: Record<string, any>, res: Record<string, any>, next: () => void): Promise<any> {
      /*
        Normal user mode -> Check Auth
         */
      let token = req.header('Authorization') ? req.header('Authorization').split(' ')[1] : null;

      if (!token) token = req.query.token || null;
      if (!token) return this.helperService.throwException('Token is missing', HttpStatus.FORBIDDEN);

      const verify = await this.authService.verifyToken(token);

      req.user = verify.user;
      req.user.id = verify.user._id.toString();
      req.guardAuth = verify.payload.guard;
      req.expireAtAuth = verify.payload.expireAt;
      req.tokenAuth = token;
      return next();
   }
}
