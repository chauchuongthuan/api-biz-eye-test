import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '../constants/message.enum';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ResponseService {
   private locale: string;

   constructor(private configService: ConfigService, @Inject(REQUEST) private request: any) {
      this.locale = request.locale;
   }

   credentialFail(message: string = MessageEnum.FAILED): object {
      return {
         status: false,
         statusCode: HttpStatus.UNAUTHORIZED,
         message: message,
      };
   }

   detailFail(message: string = MessageEnum.FIND_ONE_FAILED): object {
      return {
         status: false,
         statusCode: HttpStatus.NOT_FOUND,
         message: message,
      };
   }

   createdFail(message: string = MessageEnum.CREATE_FAILED): object {
      return {
         status: false,
         statusCode: HttpStatus.FAILED_DEPENDENCY,
         message: message,
      };
   }

   updatedFail(message: string = MessageEnum.UPDATE_FAILED): object {
      return {
         status: false,
         statusCode: HttpStatus.FAILED_DEPENDENCY,
         message: message,
      };
   }

   deletedFail(message: string = MessageEnum.DELETE_FAILED): object {
      return {
         status: false,
         statusCode: HttpStatus.FAILED_DEPENDENCY,
         message: message,
      };
   }

   //

   detailSuccess(data = null, message: string = MessageEnum.FIND_ONE_SUCCESS): object {
      return {
         status: true,
         statusCode: HttpStatus.OK,
         message: message,
         data,
      };
   }

   createdSuccess(data = null, message: string = MessageEnum.CREATE_SUCCESS): object {
      return {
         status: true,
         statusCode: HttpStatus.OK,
         message: message,
         data,
      };
   }

   updatedSuccess(data = null, message: string = MessageEnum.UPDATE_SUCCESS): object {
      return {
         status: true,
         statusCode: HttpStatus.OK,
         message: message,
         data,
      };
   }

   deletedSuccess(data = null, message: string = MessageEnum.DELETE_SUCCESS): object {
      return {
         status: true,
         statusCode: HttpStatus.OK,
         message: message,
         data,
      };
   }

   fetchListSuccess(data = null, message: string = MessageEnum.FIND_ALL_SUCCESS): object {
      return {
         status: true,
         statusCode: HttpStatus.OK,
         message: message,
         data,
      };
   }
}
