import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ActivityService } from '@common/activities/services/activity.service';
import { ActivityDto } from '@src/common/activities/admin/dtos';
import { tap } from 'rxjs/operators';
import * as requestIp from 'request-ip';
const { v4: uuidv4 } = require('uuid');
import { UrlName } from '@core/constants/url.enum';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
   constructor(private readonly activityService: ActivityService) {}
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      if (request.method !== 'GET') {
         // const response = context.switchToHttp().getResponse();
         const getClass = context.getClass().name;
         const requestID = uuidv4();
         const data = {
            request_id: requestID,
            host: request.headers.host,
            accept: request.headers.accept,
            user_agent: request.headers['user-agent'],
            body: request.body,
            param: request.param,
            query: request.query,
            url: request.url,
            project: process.env.NODE_NAME,
            env: process.env.NODE_ENV || 'local',
            method: request.method,
            http_version: request.httpVersion,
            remote_addr: request.clientIp ? request.clientIp : requestIp.getClientIp(request),
            user_id: request.user._id || null,
            timestamp: new Date().getTime,
         };

         const activityDto = new ActivityDto();
         let nameActivity = '';
         const tableVi = UrlName(getClass)['vi'];
         const tableEn = UrlName(getClass)['en'];
         const methodNameVi =
            request.method == 'POST' ? 'tạo' : request.method == 'PUT' ? 'cập nhật' : request.method == 'DELETE' ? 'xoá' : '';
         const methodNameEn =
            request.method == 'POST'
               ? 'created'
               : request.method == 'PUT'
               ? 'updated'
               : request.method == 'DELETE'
               ? 'deleted'
               : '';
         return next.handle().pipe(
            tap((d) => {
               data.body = { ...request.body };
               nameActivity = data.body.name
                  ? data.body.name
                  : data.body.ids
                  ? JSON.stringify(data.body.ids)
                  : data.body.email
                  ? data.body.email
                  : '';
               activityDto.message_vi = `vừa ${methodNameVi} ${tableVi} ${nameActivity}`;
               activityDto.message_en = `just ${methodNameEn} ${tableEn} ${nameActivity}`;
               activityDto.screen = UrlName(getClass)['screen'];
               activityDto.user = request['user']._id || 'admin';
               activityDto.url = request.url;
               activityDto.aggregateID = d.data?.id ? d.data.id : null;
               activityDto.method = request.method;
               activityDto.dataResponse = d.data;
               activityDto.dataRequest = data;
               if (d.statusCode == 200) this.activityService.create(activityDto);
            }),
         );
      } else {
         return next.handle();
      }
   }
}
