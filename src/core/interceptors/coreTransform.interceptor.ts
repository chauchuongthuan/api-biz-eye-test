import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { CorePaginateResult } from '@core/interfaces/corePaginateResult.interface';
import { CoreResponse } from '@core/interfaces/coreResponse.interface';
import { ExportService } from '@core/services/export.service';
import { HelperService } from '../services/helper.service';
@Injectable()
export class CoreTransformInterceptor implements NestInterceptor<CorePaginateResult> {
   constructor(private exportService: ExportService, private helperService: HelperService) {}

   intercept(context: ExecutionContext, next: CallHandler): Observable<CorePaginateResult> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse<Response>();
      return next.handle().pipe(
         map((result: CoreResponse) => {
            const respStatus = typeof result.status != 'undefined' ? result.status : true;
            response.statusCode = result.statusCode || HttpStatus.OK;
            // This line must below respStatus check
            const respMessage = result.message || 'No Message';
            const respStatusCode = result.statusCode || response.statusCode;
            if (result.excel) {
               /*
                    Export Excel
                     */
               this.exportService.toExcel(response, result, respStatusCode);
            } else {
               if (result.data) {
                  const encryptData = this.helperService.encryptRes(request, result.data, `${Date.now()}`);
                  // Paging/Single documents
                  if (typeof result.data['docs'] != 'undefined') {
                     return {
                        status: respStatus,
                        statusCode: respStatusCode,
                        message: respMessage,
                        data: encryptData,
                     };
                  } else {
                     return {
                        status: respStatus,
                        statusCode: respStatusCode,
                        message: respMessage,
                        data: encryptData,
                     };
                  }
               } else {
                  return {
                     status: respStatus,
                     statusCode: respStatusCode,
                     message: respMessage,
                     data: null,
                  };
               }
            }
         }),
      );
   }
}
