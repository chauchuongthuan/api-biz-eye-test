import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerAuthorService {
   private locale;

   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {
      this.locale = this.request.locale;
   }

   transformAuthorList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformAuthorDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformAuthorDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformAuthorDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         gender: doc.gender,
         name: doc.name,
         nameNone: doc.nameNon,
         isActive: doc.isActive,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformAuthorExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `Customers-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       let profileImage = null;
                       if (doc.profileImage) {
                          doc.profileImage.includes('http') || doc.profileImage.includes('https')
                             ? (profileImage = doc.profileImage)
                             : (profileImage = doc.thumb('profileImage', 'FB'));
                       }
                       return {
                          id: `${doc._id}`,
                          gender: doc.gender,
                          name: doc.name,
                          consultants: doc.consultants,
                          agency: doc.agency,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Gender', 'Name', 'consultants', 'agency', 'createdAt', 'Date Modified'],
         },
      };
   }
}
