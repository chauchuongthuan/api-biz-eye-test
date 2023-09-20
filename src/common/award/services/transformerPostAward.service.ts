import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DateTime } from '@core/constants/dateTime.enum';
import { photos, thumb } from '@src/core/helpers/file';
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

   transformAwardetail(doc, appendData = {}, isTranslate = false) {
      if (!doc || doc == doc._id) return doc;
      let url = '';
      if (doc?.award?.length > 0) {
         url = `${process.env.GC_URL}/${process.env.PREFIX_UPLOAD_URL}/awards/${doc?.award[0]._id}/image/${doc?.award[0].image}`;
      }
      if (doc && doc.award && doc.award[0]) {
         doc.award[0].image = url;
      }
      return {
         id: doc._id,
         isHost: doc?.isHost ? doc?.isHost : false,
         image: doc.thumb('image'),
         thumbnailVideo: doc.thumb('thumbnailVideo'),
         shortDescription: doc.shortDescription,
         title: doc.title,
         slug: doc.slug,
         challenge: doc.challenge,
         solution: doc.solution,
         video: doc.video,
         detailImage: doc.thumb('detailImage'),
         client: doc.client,
         shareOfVoice: doc?.shareOfVoice ? doc?.shareOfVoice : [],
         // followers: doc.followers,
         // engagementRate: doc.engagementRate,
         // impressions: doc.impressions,
         gallery: doc.gallery && doc.gallery.length > 0 ? photos(doc, 'gallery', 'Postawards') : [],
         social: doc.social && doc.social.length > 0 ? photos(doc, 'social', 'Postawards') : [],
         // award: doc.award,
         awardImage: doc.award,
         category: doc.category,
         expertise: doc.expertise,
         metaImage: doc.thumb('metaImage'),
         metaTitle: doc.metaTitle,
         metaKeyword: doc.metaKeyword,
         metaDescription: doc.metaDescription,
         deletedAt: doc.deletedAt ? doc.deletedAt : null,
         createdAt: moment(doc.createdAt).format(DateTime.CREATED_AT),
         updatedAt: moment(doc.updatedAt).format(DateTime.CREATED_AT),
         ...appendData,
      };
   }
}
