import * as helperFile from '@core/helpers/file';
import { isArray, isObject } from 'util';

module.exports = exports = function updatedAtPlugin(schema, options) {
   schema.pre('remove', async function (next) {
      if (typeof this.thumbnail === 'function') {
         const thumbnail = this.thumbnail();
         const self = this;
         if (thumbnail && thumbnail['fields'] && thumbnail['collection']) {
            helperFile.deleteFolder(`${thumbnail['collection']}/${this.id}`);
         }
      }
      next();
   });

   schema.methods.thumb = function (field: string, type: string): string {
      if (typeof this.thumbnail === 'function') {
         const thumbnail = this.thumbnail();
         const self = this;
         if (!this[field]) {
            return null;
         } else {
            return helperFile.thumb(this, field, thumbnail['collection'], thumbnail['fields'][field], type);
         }
      }
   };

   schema.methods.thumbTrans = function (field: string, type: string, locale?: string): string | object {
      if (typeof this.thumbnail === 'function') {
         const thumbnail = this.thumbnail();
         const self = this;
         if (!this[field]) {
            return null;
         } else {
            return helperFile.thumbTrans(this, field, thumbnail['collection'], locale, thumbnail['fieldTrans'][field], type);
         }
      }
   };

   schema.methods.photos = function (field: string, type: string): Array<string> {
      if (typeof this.thumbPhotos === 'function') {
         const thumbPhotos = this.thumbPhotos();
         const self = this;
         if (!this[field]) {
            return [];
         } else {
            return helperFile.photos(this, field, thumbPhotos['collection'], thumbPhotos['fields'][field], type);
         }
      }
   };

   schema.methods.downloadThumb = async function (res: any, field: string, type: string): Promise<any> {
      if (typeof this.thumbnail === 'function') {
         const thumbnail = this.thumbnail();
         const self = this;
         if (!this[field]) {
            return { status: true };
         } else {
            return helperFile.downloadThumb(res, this, field, thumbnail['collection'], thumbnail['fields'][field], type);
         }
      }
   };
};
