import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerCustomerCareService {
   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {}

   transformCustomerCareTypeList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformCustomerCareTypeDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformCustomerCareTypeDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformCustomerCareTypeDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         name: doc.name,
         slug: doc.slug,
         status: doc.status,
         image: doc.image ? doc.thumb('image') : null,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformCustomerCareTypeExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `CustomerCareTypes-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       let image = null;
                       if (doc.image) {
                          doc.image.includes('http') || doc.image.includes('https')
                             ? (image = doc.image)
                             : (image = doc.thumb('image'));
                       }
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          slug: doc.slug,
                          status: doc.status,
                          image: image,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Name', 'Slug', 'Status', 'Image', 'createdAt', 'Date Modified'],
         },
      };
   }

   transformCustomerCareListList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformCustomerCareListDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformCustomerCareListDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformCustomerCareListDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         name: doc.name,
         nameNon: doc.nameNon,
         status: doc.status,
         content: doc.content,
         type: doc.type,
         image: doc.image ? doc.thumb('image') : null,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformCustomerCareListExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `CustomerCareLists-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       let image = null;
                       if (doc.image) {
                          doc.image.includes('http') || doc.image.includes('https')
                             ? (image = doc.image)
                             : (image = doc.thumb('image'));
                       }
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          nameNon: doc.nameNon,
                          type: doc.type,
                          status: doc.status,
                          content: doc.content,
                          image: image,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Name',
               'NameNon',
               'Type',
               'Status',
               'Content',
               'Image',
               'createdAt',
               'Date Modified',
            ],
         },
      };
   }
}
