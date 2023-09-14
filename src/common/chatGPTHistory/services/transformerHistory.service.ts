import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerHistoryService {
   private locale;

   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {
      this.locale = this.request.locale;
   }

   transformHistoryList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformHistorydetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformHistorydetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformHistorydetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         question: doc.question,
         answer: doc.answer,
         dataTypes: doc.dataTypes,
         responseTime: doc.responseTime,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }
}
