import { SchemaTypes } from 'mongoose';

export const MultiLanguageRequiredProp = {
   type: SchemaTypes.Mixed,
   // en: {
   //     type: String,
   //     default: null,
   //     required: true,
   //     trim: true
   // },
   vi: {
      type: String,
      default: null,
      required: true,
      trim: true,
   },
   viNon: {
      type: String,
      default: null,
      required: true,
      trim: true,
   },
};
export const MultiLanguageProp = {
   type: SchemaTypes.Mixed,
   // en: {
   //     type: String,
   //     default: null,
   //     trim: true
   // },
   vi: {
      type: String,
      default: null,
      trim: true,
   },
   viNon: {
      type: String,
      default: null,
      trim: true,
   },
};

export const MultiLanguageUniqueProp = {
   type: Map,
   // en: {
   //     type: String,
   //     required: true,
   //     trim: true,
   //     unique: true,
   // },
   vi: {
      type: String,
      required: true,
      trim: true,
      unique: true,
   },
   viNon: {
      type: String,
      required: true,
      trim: true,
      unique: true,
   },
};

export const MultiLanguageContentProp = {
   type: SchemaTypes.Mixed,
   // en: {
   //     type: Array,
   //     default: null,
   //     trim: true
   // },
   vi: {
      type: Array,
      default: null,
      trim: true,
   },
   viNon: {
      type: Array,
      default: null,
      trim: true,
   },
};

export const MultiLanguageSlugProp = {
   type: Map,
   // en: {
   //     type: String,
   //         required: true,
   //         trim: true,
   //         unique: true,
   //         set: function(en) {
   //             en = en.replace(/^\s+|\s+$/g, "");
   //             en = en.replace(/\ +/g, "-");
   //             en = en.toLowerCase();
   //             return en;
   //     }
   // },
   vi: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      set: function (vi) {
         vi = vi.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
         vi = vi.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
         vi = vi.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
         vi = vi.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
         vi = vi.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
         vi = vi.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
         vi = vi.replace(/đ/g, 'd');
         // Some system encode vietnamese combining accent as individual utf-8 characters
         vi = vi.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
         vi = vi.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

         vi = vi.replace(/^\s+|\s+$/g, '');
         vi = vi.replace(/\ +/g, '-');
         vi = vi.toLowerCase();
         return vi;
      },
   },
};

// export const Languages = ['vi', 'en'];
export const Languages = ['vi'];
