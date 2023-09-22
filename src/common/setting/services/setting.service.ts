import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from '@schemas/setting.schemas';
import { deleteFile, saveFile, isFile } from '@core/helpers/file';
import { Post } from '@src/schemas/posts/post.schemas';
@Injectable()
export class SettingService {
   constructor(
      @InjectModel(Setting.name) private setting: PaginateModel<Setting>,
      @InjectModel(Post.name) private post: PaginateModel<Post>,
   ) {}

   async findAll(isFe = false): Promise<any> {
      let nameNotIn = ['access', 'accessByMonth', 'accessByMinute', 'accessByMobile', 'accessByWindow'];
      if (isFe) return this.setting.find({ name: { $nin: nameNotIn } }).exec();
      return this.setting.find().exec();
   }

   async update(data: Record<string, any>, files: Array<object>): Promise<any> {
      const settings = [];
      const oldFiles = [];
      Object.keys(data).forEach(function (name) {
         settings.push({
            name: name,
            value: data[name],
         });

         if (isFile(data[name])) {
            oldFiles.push(data[name]);
         }
      });
      await Promise.all(
         files.map(async function (file) {
            settings.push({
               name: file['fieldname'],
               value: file['filename'],
            });
            await saveFile(file['filename'], `setting`);
         }),
      );
      try {
         const docs = await this.setting.find({});
         for (const doc of docs) {
            if (isFile(doc.value) && !oldFiles.includes(doc.value)) {
               deleteFile(doc.value, 'setting');
            }
            if (!doc.name.includes('access')) {
               await doc.remove();
            }
         }
      } catch (err) {
         console.log(err);
      }
      // await this.setting.deleteMany({});
      await this.setting.insertMany(settings);
      return this.setting.find().exec();
   }

   // async countAccess() {
   //    // const access = await this.setting.findOne({ name: 'access' });
   //    const access = await this.setting.updateOne({ name: 'access' }, [
   //       {
   //          $set: {
   //             value: {
   //                $toString: {
   //                   $subtract: [{ $toInt: '$value' }, -1],
   //                },
   //             },
   //          },
   //       },
   //    ]);
   // }

   // async countAccessByMonth() {
   //    const accessByMonth = await this.setting.updateOne({ name: 'accessByMonth' }, [
   //       {
   //          $set: {
   //             value: {
   //                $toString: {
   //                   $subtract: [{ $toInt: '$value' }, -1],
   //                },
   //             },
   //          },
   //       },
   //    ]);
   // }

   // async countAccessByMinute() {
   //    const accessByMinute = await this.setting.updateOne({ name: 'accessByMinute' }, [
   //       {
   //          $set: {
   //             value: {
   //                $toString: {
   //                   $subtract: [{ $toInt: '$value' }, -1],
   //                },
   //             },
   //          },
   //       },
   //    ]);
   // }

   // async countAccessByWindow() {
   //    const accessByWindow = await this.setting.updateOne({ name: 'accessByWindow' }, [
   //       {
   //          $set: {
   //             value: {
   //                $toString: {
   //                   $subtract: [{ $toInt: '$value' }, -1],
   //                },
   //             },
   //          },
   //       },
   //    ]);
   // }
   // async countAccessByMobile() {
   //    const accessByMobile = await this.setting.updateOne({ name: 'accessByMobile' }, [
   //       {
   //          $set: {
   //             value: {
   //                $toString: {
   //                   $subtract: [{ $toInt: '$value' }, -1],
   //                },
   //             },
   //          },
   //       },
   //    ]);
   // }

   async countAccessByCountry(country: any) {
      const exist = await this.setting.findOneAndUpdate(
         { name: `accessByCountry_${country}` },
         {
            $setOnInsert: {
               name: `accessByCountry_${country}`,
               value: '0',
            },
         },
         { upsert: true, new: true, runValidators: true },
      );
      if (exist) {
         const accessByCountry = await this.setting.updateOne({ name: `accessByCountry_${country}` }, [
            {
               $set: {
                  value: {
                     $toString: {
                        $subtract: [{ $toInt: '$value' }, -1],
                     },
                  },
               },
            },
         ]);
      }
   }

   async updateView(postSlug: any) {
      const updateView = await this.post.updateOne({ slug: postSlug }, { $inc: { view: 1 } });
   }
}
