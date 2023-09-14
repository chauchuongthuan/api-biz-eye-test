import { DateTime } from '@core/constants/dateTime.enum';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerRoleService {
   private locale;

   constructor(@Inject(REQUEST) private request: any) {
      this.locale = this.request.locale;
   }

   // Role
   transformRoleList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformRoleDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformRoleDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformRoleDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         isAdmin: doc.isAdmin,
         name: doc.name,
         nameNon: doc.nameNon,
         permissions: doc.permissions,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformRoleExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `Roles-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          isAdmin: doc.isAdmin,
                          name: doc.name,
                          nameNon: doc.nameNon,
                          permissions: JSON.stringify(doc.permissions),
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Admin', 'Name', 'Name Non', 'Permissions', 'Created At', 'updated At'],
         },
      };
   }
}
