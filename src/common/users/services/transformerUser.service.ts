import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerUserService {
   private locale;

   constructor(@Inject(REQUEST) private request: any, private readonly transformerRole: TransformerRoleService) {
      this.locale = this.request.locale;
   }

   // Role
   transformUserList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformUserDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformUserDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformUserDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         profileImage: doc.profileImage ? doc.thumb('profileImage') : undefined,
         name: doc.name,
         nameNon: doc.nameNon,
         email: doc.email,
         phone: doc.phone,
         active: doc.active,
         isAdmin: doc.role != null ? doc.role.isAdmin : null,
         role: this.transformerRole.transformRoleDetail(doc.role),
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformUserExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      const self = this;
      return {
         excel: {
            name: fileName || `Users-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          profileImage: doc.profileImage ? doc.thumb('profileImage', 'FB') : null,
                          name: doc.name,
                          nameNon: doc.nameNon,
                          email: doc.email,
                          phone: doc.phone,
                          active: doc.active == true ? 'Có' : 'Không',
                          role: doc.role ? JSON.stringify(self.transformerRole.transformRoleDetail(doc.role)) : '',
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Profile image',
               'Name',
               'Name Non',
               'Email',
               'Phone',
               'Active',
               'Role',
               'Create At',
               'modified At',
            ],
         },
      };
   }
}
