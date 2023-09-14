import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
import { StatusTrans } from '@core/constants/post.enum';
import { TransformerUserService } from '@src/common/users/services/transformerUser.service';
import { InjectModel } from '@nestjs/mongoose';
import { PostComment } from '@src/schemas/posts/postComment.schemas';
import { PaginateModel } from 'mongoose';
import { photos } from '@src/core/helpers/file';
const moment = require('moment');
@Injectable({ scope: Scope.REQUEST })
export class TransformerPostService {
   private locale;

   constructor(
      @Inject(REQUEST) private request: any,
      private transformUser: TransformerUserService,
      @InjectModel(PostComment.name) private comment: PaginateModel<PostComment>,
   ) {
      this.locale = this.request.locale;
   }

   transformCategoryList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformCategoryDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformCategoryDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformCategoryDetail(doc, appendData = {}, isTranslate = false) {
      const locale = this.locale;
      const mustTranslate = locale && isTranslate;
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         title: doc.title,
         slug: doc.slug,
         shortDescription: doc.shortDescription,
         active: doc.active,
         sortOrder: doc.sortOrder,
         count: doc.count,
         metaTitle: doc.metaTitle,
         metaImage: doc.thumb('metaImage', ''),
         metaDescription: doc.metaDescription,
         metaKeyword: doc.metaKeyword,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformCategoryExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `PostCategories-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                     return {
                        id: `${doc._id}`,
                        title: doc.title,
                        slug: doc.slug,
                        shortDescription: doc.shortDescription,
                        active: doc.active == true ? 'Có' : 'Không',
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                     };
                  })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Tiêu đề',
               'Slug',
               'Mô tả ngắn',
               // 'Nội dung',
               'Trạng thái',
               'Thứ tự',
               'Ngày tạo',
            ],
         },
      };
   }

   async transformPostList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         for (let i = 0; i < docs.docs.length; i++) {
            docs.docs[i] = await self.transformPostDetail(docs.docs[i], appendDetailData, isTranslate);
         }
         // docs.docs = docs.docs.map(function (doc) {
         //    return self.transformPostDetail(doc, appendDetailData, isTranslate);
         // });
         return await {
            ...docs,
            ...appendListData,
         };
      } else {
         for (let i = 0; i < docs.length; i++) {
            docs[i] = await self.transformPostDetail(docs[i], appendDetailData, isTranslate);
         }
         // docs = docs.map(function (doc) {
         //    return self.transformPostDetail(doc, appendDetailData, isTranslate);
         // });
         return await docs;
      }
   }

   async transformPostDetail(doc, appendData = {}, isTranslate = false) {
      const locale = this.locale;
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         author: doc.author,
         lastEditor: doc.lastEditor,
         feature: doc.feature,
         commentCount: await this.comment.countDocuments({ post: doc._id }),
         postCategory: this.transformCategoryDetail(doc.postCategory),
         tags: this.transformTagList(doc.tags),
         tagNames: doc.tags.length ? doc.tags.map((tag) => tag.name) : [],
         assigned: this.transformUser.transformUserList(doc.assigned),
         assignedNames: doc.assigned.length ? doc.assigned.map((user) => user.name) : [],
         image: doc.thumb('image'),
         imageMb: doc.thumb('imageMb'),
         title: doc.title,
         slug: doc.slug,
         shortDescription: doc.shortDescription,
         content: doc.content,
         status: doc.status,
         statusText: StatusTrans(doc.status),
         publishedAt: doc.publishedAt ? moment(doc.publishedAt).format(DateTime.CREATED_AT) : undefined,
         readTime: doc.readTime,
         sortOrder: doc.sortOrder,
         metaTitle: doc.metaTitle,
         metaImage: doc.thumb('metaImage'),
         gallery: doc.gallery && doc.gallery.length > 0 ? photos(doc, 'gallery', 'posts') : [],
         metaDescription: doc.metaDescription,
         metaKeyword: doc.metaKeyword,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformPostExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      const self = this;
      return {
         excel: {
            name: fileName || `Posts-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                     return {
                        id: `${doc._id}`,
                        postCategory: JSON.stringify(self.transformCategoryDetail(doc.postCategory)),
                        tagNames: JSON.stringify(doc.tags.length ? doc.tags.map((tag) => tag.name) : []),
                        image: doc.thumb('image'),
                        imageMb: doc.thumb('imageMb'),
                        title: JSON.stringify(doc.title),
                        slug: JSON.stringify(doc.slug),
                        shortDescription: JSON.stringify(doc.shortDescription),
                        content: JSON.stringify(doc.content),
                        statusText: StatusTrans(doc.status),
                        publishedAt: doc.publishedAt ? moment(doc.publishedAt).format(DateTime.CREATED_AT) : null,
                        sortOrder: doc.sortOrder,
                        feature: doc.feature == true ? 'Có' : 'Không',
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                     };
                  })
                  : [{}],
            customHeaders: customHeaders || [
               'ID',
               'Chuyên mục',
               'Tags',
               'Hình',
               'Hình di động',
               'Tiêu đề',
               'Slug',
               'Mô tả ngắn',
               'Nội dung',
               'Trạng thái',
               'Ngày đăng',
               'Thứ tự',
               'Đặc sắc',
               'Ngày tạo',
            ],
         },
      };
   }

   // Tag
   transformTagList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformTagDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformTagDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformTagDetail(doc, appendData = {}, isTranslate = false) {
      const locale = this.locale;
      const mustTranslate = locale && isTranslate;
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         name: doc.name,
         slug: doc.slug,
         active: doc.active,
         sortOrder: doc.sortOrder,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }

   transformTagExport(docs, appendData = {}, fileName?: string, customHeaders?: Array<string>) {
      return {
         excel: {
            name: fileName || `Tags-${moment().format('YYYY-MM-DD')}`,
            data:
               docs.length > 0
                  ? docs.map(function (doc) {
                     return {
                        id: `${doc._id}`,
                        name: doc.name,
                        slug: doc.slug,
                        active: doc.active == true ? 'Có' : 'Không',
                        sortOrder: doc.sortOrder,
                        createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
                     };
                  })
                  : [{}],
            customHeaders: customHeaders || ['ID', 'Tên', 'Slug', 'Trạng thái', 'Thứ tự', 'Ngày tạo'],
         },
      };
   }

   // Comment
   transformCommentList(docs, appendDetailData = {}, isTranslate = false, appendListData = {}) {
      const self = this;
      if (docs.docs) {
         docs.docs = docs.docs.map(function (doc) {
            return self.transformCommentDetail(doc, appendDetailData, isTranslate);
         });
         return {
            ...docs,
            ...appendListData,
         };
      } else {
         docs = docs.map(function (doc) {
            return self.transformCommentDetail(doc, appendDetailData, isTranslate);
         });
         return docs;
      }
   }

   transformCommentDetail(doc, appendData = {}, isTranslate = false) {
      const locale = this.locale;
      const mustTranslate = locale && isTranslate;
      if (!doc || doc == doc._id) return doc;
      return {
         id: doc.id,
         author: this.transformUser.transformUserDetail(doc.author),
         post: doc.post,
         content: doc.content,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }
}
