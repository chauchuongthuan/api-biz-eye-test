import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TransformerRoleService } from '@common/roles/services/transformerRole.service';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerTokenDrawService {
   private locale;

   constructor(@Inject(REQUEST) private request: any, private readonly transformerRole: TransformerRoleService) {
      this.locale = this.request.locale;
   }

   // Role
   transformTokenDrawList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformTokenDrawDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformTokenDrawDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformTokenDrawDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         name: doc.name,
         nameNon: doc.nameNon,
         token: doc.token,
         active: doc.active,
         isWin: doc.isWin,
         winDate: doc.winDate !== null ? moment(doc.winDate).format(DateTime.CREATED_AT) : '',
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformUserExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      const self = this;
      console.log(docs);
      return {
         excel: {
            name: fileName || `Users-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          nameNon: doc.nameNon,
                          token: doc.token,
                          active: doc.active == true ? 'Có' : 'Không',
                          winDate: moment(doc.winDate).format(DateTime.CREATED_AT),
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Name',
               'Name Non',
               'Mã trúng giải',
               'Active',
               'WinDate',
               'Create At',
               'modified At',
            ],
         },
      };
   }
}
