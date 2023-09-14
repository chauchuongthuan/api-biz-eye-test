import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@src/core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerGptService {
   private locale;

   constructor(@Inject(REQUEST) private request: any) {
      this.locale = this.request.locale;
   }

   transformGptList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      var self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformGptDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformGptDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformGptDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         profileImage: doc.profileImage ? doc.thumb('profileImage', 'FB') : undefined,
         name: doc.name,
         email: doc.email,
         verifiedEmail: doc.verifiedEmail,
         phone: doc.phone,
         birthdate: doc.birthdate ? moment(doc.birthdate).format(DateTime.BIRTHDATE) : undefined,
         address: doc.address,
         province: doc.province,
         district: doc.district,
         active: doc.active,
         authType: doc.authType,
         social: doc.social,
         hasPassword: doc.social && !doc.password ? false : true,
         totalCommingShow: doc.totalCommingShow,
         totalPreviousShow: doc.totalPreviousShow,
         lastLogin: doc.lastLogin ? moment(doc.lastLogin).format(DateTime.CREATED_AT) : undefined,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformGptExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `Gpts-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          profileImage: doc.profileImage ? doc.thumb('profileImage', 'FB') : null,
                          name: doc.name,
                          phone: doc.phone,
                          email: doc.email,
                          verifiedEmail: doc.verifiedEmail ? 'Đã xác thực' : '',
                          active: doc.active == true ? 'Hoạt động' : 'Khóa',
                          totalCommingShow: doc.totalCommingShow,
                          totalPreviousShow: doc.totalPreviousShow,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Ảnh đại diện',
               'Tên',
               'SĐT',
               'Email',
               'Xác thưc Email',
               'Trạng thái',
               'Show sắp diễn ra',
               'Show đã diễn ra',
               'Ngày tạo',
            ],
         },
      };
   }
}
