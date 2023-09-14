import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { urlFile, isFile } from '@core/helpers/file';
@Injectable({ scope: Scope.REQUEST })
export class TransformerSettingService {
   private locale;

   constructor(@Inject(REQUEST) private request: any) {
      this.locale = this.request.locale;
   }

   // Role
   transformSettingList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformSettingDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformSettingDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformSettingDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         name: doc.name,
         value: isFile(doc.value) ? urlFile(doc.value, 'setting') : doc.value,
         ...appendData,
      };
   }
}
