import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
import { photos, thumb } from '@src/core/helpers/file';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerAwardService {
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
      let url = '';

      if (doc?.award?.length > 0) {
         url = `${process.env.GC_URL}/${process.env.PREFIX_UPLOAD_URL}/awards/${doc?.award[0]._id}/image/${doc?.award[0].image}`;
      }
      if (doc && doc.award && doc.award[0]) {
         doc.award[0].image = url;
      }
      return {
         id: doc._id,
         title: doc.title,
         client: doc.client,
         subTitle: doc.subTitle,
         slug: doc.slug,
         // award: doc.award,
         award: doc.award,
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
