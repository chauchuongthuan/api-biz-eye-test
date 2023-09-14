import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerCustomerService {
   private locale;

   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {
      this.locale = this.request.locale;
   }

   transformCustomerList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformCustomerDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformCustomerDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformCustomerDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         gender: doc.gender,
         name: doc.name,
         phone: doc.phone,
         email: doc.email,
         password: doc.password,
         active: doc.active,
         dateOfBirth: moment(doc.dateOfBirth).format(DateTime.CREATED_AT),
         profileImage: doc.profileImage ? doc.thumb('profileImage') : null,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformCustomerExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
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
                             : (profileImage = doc.thumb('profileImage'));
                       }
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          gender: doc.gender,
                          phone: doc.phone,
                          dateOfBirth: doc.dateOfBirth,
                          profileImage: profileImage,
                          active: doc.active == true ? 'Có' : 'Không',
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Name',
               'Gender',
               'Phone',
               'Birthday',
               'Profile Image',
               'Active',
               'createdAt',
               'Date Modified',
            ],
         },
      };
   }
}
