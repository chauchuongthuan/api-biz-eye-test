import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
const moment = require('moment');

@Injectable({ scope: Scope.REQUEST })
export class TransformerMailListService {
   constructor(
      @Inject(REQUEST) private request: any, // private readonly transformerRole: TransformerRoleService,
   ) {}

   transformMailListList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformMailListDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformMailListDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformMailListDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         email: doc.email,
         name: doc.name,
         interests: this.transformInterestList(doc.interests),
         interestsNames: doc.interests.length ? doc.interests.map((interest) => interest.name) : [],
         status: doc.status,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformMailListExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      const self = this;
      return {
         excel: {
            name: fileName || `MailLists-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          email: doc.email,
                          name: doc.name,
                          interests: JSON.stringify(doc.interests.length ? doc.interests.map((interest) => interest.name) : []),
                          status: doc.status,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Email', 'Name', 'Interest', 'Status', 'createdAt', 'Date Modified'],
         },
      };
   }

   // Schedule
   transformMailScheduleList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformMailScheduleDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformMailScheduleDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformMailScheduleDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc._id,
         name: doc.name,
         interests: this.transformInterestList(doc.interests),
         interestsNames: doc.interests.length ? doc.interests.map((interest) => interest.name) : [],
         assigned: this.transformMailListList(doc.assigned),
         assignedNames: doc.assigned.length ? doc.assigned.map((user) => user.name) : [],
         status: doc.status,
         statusSent: doc.statusSent,
         sendAt: doc.sendAt ? moment(doc.sendAt).format(DateTime.CREATED_AT) : '',
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformMailScheduleExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      const self = this;
      return {
         excel: {
            name: fileName || `MailSchedules-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          interests: JSON.stringify(doc.interests.length ? doc.interests.map((interest) => interest.name) : []),
                          assigned: JSON.stringify(doc.assigned.length ? doc.assigned.map((assigned) => assigned.name) : []),
                          status: doc.status,
                          statusSent: doc.statusSent,
                          sendAt: doc.sendAt ? moment(doc.sendAt).format(DateTime.CREATED_AT) : '',
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                          updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Name',
               'Interest',
               'Assigned',
               'Status',
               'Status Sent',
               'Send At',
               'Created At',
               'Date Modified',
            ],
         },
      };
   }

   // Interest
   transformInterestList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformInterestDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformInterestDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformInterestDetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         name: doc.name,
         slug: doc.slug,
         status: doc.status,
         sortOrder: doc.sortOrder,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformInterestExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `Interests-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                       return {
                          id: `${doc._id}`,
                          name: doc.name,
                          slug: doc.slug,
                          status: doc.status == true ? 'Có' : 'Không',
                          sortOrder: doc.sortOrder,
                          createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                       };
                    })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Tên', 'Slug', 'Trạng thái', 'Thứ tự', 'Ngày tạo'],
         },
      };
   }
}
