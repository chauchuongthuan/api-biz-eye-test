import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
import { thumb } from '@src/core/helpers/file';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerPostAwardService {
   private locale;

   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {
      this.locale = this.request.locale;
   }

   transformAwardList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformAwardetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformAwardetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformAwarFrontend(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;

      // const result = {};
      // for (const group of doc) {
      //    result[group.year] = group.documents;
      // }
      // console.log(result);

      return {
         id: doc._id,
         title: doc.title,
         client: doc.client,
         subTitle: doc.subTitle,
         slug: doc.slug,
         shortDescription: doc.shortDescription,
         image: doc.thumb('image'),
         sortOrder: doc.sortOrder,
         active: doc.active,
         year: doc.year,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformAwardetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         title: doc.title,
         client: doc.client,
         subTitle: doc.subTitle,
         slug: doc.slug,
         shortDescription: doc.shortDescription,
         image: doc.thumb('image'),
         sortOrder: doc.sortOrder,
         active: doc.active,
         year: doc.year,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }
}