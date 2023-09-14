import { extname } from 'path';
import * as contentHelper from './content';
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const path = require('path');
const fs = require('fs');
const randomstring = require('randomstring');
const mime = require('mime');
const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const is_image = require('is-image');
const moment = require('moment');
const fsPromises = fs.promises;
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const sharp = require('sharp');
export interface compressOptionInterface {
   jpg: number;
   png: number;
}

export function configUpload() {
   return {
      NODE_URL: process.env.NODE_URL,
      FILESYSTEM_DRIVER: process.env.FILESYSTEM_DRIVER,
      PREFIX_UPLOAD: process.env.PREFIX_UPLOAD,
      PREFIX_UPLOAD_URL: process.env.PREFIX_UPLOAD_URL,
      PREFIX_UPLOAD_TMP: process.env.PREFIX_UPLOAD_TMP,
      DO_ACCESS_KEY_ID: process.env.DO_ACCESS_KEY_ID,
      DO_SECRET_ACCESS_KEY: process.env.DO_SECRET_ACCESS_KEY,
      DO_DEFAULT_REGION: process.env.DO_DEFAULT_REGION,
      DO_BUCKET: process.env.DO_BUCKET,
      DO_ENDPOINT: process.env.DO_ENDPOINT,
      DO_URL: process.env.DO_URL,
      GOOGLE_APPLICATION_CREDENTIALS_PEM: process.env.GOOGLE_APPLICATION_CREDENTIALS_PEM,
      GC_BUCKET: process.env.GC_BUCKET,
      GC_URL: process.env.GC_URL,
   };
}

export function cleanPath(dir: string): string {
   dir = dir.replace(/\ +/g, '').replace(/(\.\.)+/g, '');
   dir = dir[dir.length - 1] != '/' ? dir : dir.substring(0, dir.length - 1);
   return dir;
}

export function getFileNameFromPath(path: string): string {
   if (path == null) {
      return path;
   }
   const ext = path.substring(path.lastIndexOf('.'));
   const baseName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
   if (ext == path) {
      path = trim(path);
      return path.substr(path.lastIndexOf('/') + 1);
   }
   return `${baseName}${ext}`;
}

export function trimRight(str: string, char = '/'): string {
   return str[str.length - 1] == char ? str.substr(0, str.length - 1) : str;
}

export function trimLeft(str: string, char = '/'): string {
   return str[0] == char ? str.substr(1) : str;
}

export function trim(str: string, char = '/'): string {
   str = trimLeft(str, char);
   str = trimRight(str, char);
   return str;
}

export function isFile(fileName: string) {
   if (typeof fileName != 'string') {
      return false;
   }
   return fileName.match(/\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|ppt|pptx|csv)$/);
}

export async function isImage(src: string) {
   return is_image(src);
}

export async function compressImage(
   srcImage: string,
   destDir: string,
   compressOptions: compressOptionInterface = {
      jpg: 75,
      png: 75,
   },
) {
   await imagemin([srcImage], {
      destination: destDir,
      plugins: [
         imageminMozjpeg({ quality: [compressOptions.jpg, compressOptions.jpg] }),
         imageminPngquant({ quality: [compressOptions.png / 100, compressOptions.png / 100] }),
         imageminGifsicle({ colors: 64 }),
      ],
   });
}

export async function resizeImage(src: string, dest: string, width: number, height: number, fitOption = 'inside') {
   return await sharp(src)
      .resize(width, height, {
         fit: fitOption,
      })
      .toFile(dest);
   return src;
}

export function randStr(length?: number, charset?: string) {
   length = length || 12;
   charset = charset || 'alphanumeric';
   return randomstring.generate({
      length,
      charset,
   });
}

export function mkFileSync(filePath: string) {
   return fs.closeSync(fs.openSync(filePath, 'w'));
}

export function mkdirSync(path: string) {
   return fs.mkdirSync(path, { recursive: true });
}

export function thumb(doc: any, field: string, collectionName: string, scales?: object, type?: string): string {
   const fileName = doc[field];
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      var dirUrl = `${configUpload().NODE_URL}/${configUpload().FILESYSTEM_DRIVER}/${configUpload().PREFIX_UPLOAD_URL
         }/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      var dirUrl = `${configUpload().DO_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      var dirUrl = `${configUpload().GC_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   }

   if (fileName == null || fileName == 'null') {
      return null;
   }

   if (!type) {
      //origin
      var fullUrl = `${dirUrl}/${fileName}`;
   } else {
      const baseExt = extname(fileName);
      const baseName = path.basename(fileName, baseExt);
      var fullUrl = `${dirUrl}/${baseName}_${scales[type]}${baseExt}`;
   }
   // because hook not sync with method
   return fullUrl.replace(configUpload().PREFIX_UPLOAD_TMP, '');
}

export function thumbTrans(
   doc: any,
   field: string,
   collectionName: string,
   locale?: string,
   scales?: object,
   type?: string,
): any {
   const result = {};
   const fileNameTrans = doc[field];

   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      var dirUrl = `${configUpload().NODE_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      var dirUrl = `${configUpload().DO_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      var dirUrl = `${configUpload().GC_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   }

   Object.keys(fileNameTrans).forEach(function (lang) {
      const dirLangUrl = `${dirUrl}/${lang}`;
      if (lang == '$init') {
         return;
      } else if (!fileNameTrans[lang]) {
         result[lang] = null;
      } else if (!type) {
         result[lang] = `${dirLangUrl}/${fileNameTrans[lang]}`;
      } else {
         const baseExt = extname(fileNameTrans[lang]);
         const baseName = path.basename(fileNameTrans[lang], baseExt);
         result[lang] = `${dirLangUrl}/${baseName}_${scales[type]}${baseExt}`;
      }
   });
   return locale ? result[locale] : result;
}

export function photos(doc: any, field: string, collectionName: string, scales?: object, type?: string): Array<string> {
   const fileNames = doc[field];
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      var dirUrl = `${configUpload().NODE_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      var dirUrl = `${configUpload().DO_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      var dirUrl = `${configUpload().GC_URL}/${configUpload().PREFIX_UPLOAD_URL}/${collectionName}/${doc.id}/${field}`;
   }
   const thumbs = [];
   if (fileNames) {
      fileNames.forEach(function (fileName) {
         if (!type) {
            //origin
            var fullUrl = `${dirUrl}/${fileName}`;
         } else {
            const baseExt = extname(fileName);
            const baseName = path.basename(fileName, baseExt);
            var fullUrl = `${dirUrl}/${baseName}_${scales[type]}${baseExt}`;
         }
         thumbs.push(fullUrl.replace(configUpload().PREFIX_UPLOAD_TMP, ''));
      });
   } else {
      return [];
   }

   return thumbs;
}

export async function deleteFolder(dirFolder: string) {
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      return await deleteFolderLocal(dirFolder);
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      return await deleteFolderCloud(dirFolder);
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      return await deleteFolderGcCloud(dirFolder);
   } else {
      return;
   }
}
export async function saveAudio(doc: any, field: string, collectionName: string) {
   const fileName = doc[field];
   const fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileName}`;
   const dirFolder = `${collectionName}/${doc.id}/${field}`;
   if (fileName == 'null') {
      deleteFolderLocal(dirFolder);
      return null;
   } else if (fileName) {
      if (await existFileLocal(`${fileTmp}`)) {
         await deleteFolderLocal(dirFolder);
         return await saveFileLocal(fileTmp, dirFolder);
      } else {
         return fileName;
      }
   }
}
export async function saveThumb(
   doc: any,
   field: string,
   collectionName: string,
   scales?: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   const fileName = doc[field];
   const fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileName}`;
   const dirFolder = `${collectionName}/${doc.id}/${field}`;
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      if (fileName == 'null') {
         // remove
         deleteFolderLocal(dirFolder);
         return null;
      } else if (fileName) {
         // check exist file tmp
         if (await existFileLocal(`${fileTmp}`)) {
            await deleteFolderLocal(dirFolder);
            return await saveFileLocal(fileTmp, dirFolder, scales, fitOption, compressOptions);
         } else {
            // none
            return fileName;
         }
      }
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      if (fileName == 'null') {
         // remove
         deleteFolderCloud(dirFolder);
         return null;
      } else if (fileName) {
         // check exist file tmp
         if (await existFileLocal(`${fileTmp}`)) {
            deleteFolderCloud(dirFolder, [fileName]);
            return await saveFileCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
         } else {
            // none
            return fileName;
         }
      }
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      if (fileName == 'null') {
         // remove
         deleteFolderGcCloud(dirFolder);
         return null;
      } else if (fileName) {
         // check exist file tmp
         if (await existFileLocal(`${fileTmp}`)) {
            deleteFolderGcCloud(dirFolder, [fileName]);
            return await saveFileGcCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
         } else {
            // none
            return fileName;
         }
      }
   } else {
      return;
   }
}

export async function saveThumbTrans(
   doc: any,
   field: string,
   collectionName: string,
   scales?: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   const fileNameTrans = doc[field];
   await Promise.all(
      Object.keys(fileNameTrans).map(async function (locale) {
         const dirFolder = `${collectionName}/${doc.id}/${field}/${locale}`;
         if (configUpload().FILESYSTEM_DRIVER == 'public') {
            if (!fileNameTrans[locale]) {
               deleteFolderLocal(dirFolder);
            } else if (fileNameTrans[locale]) {
               var fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileNameTrans[locale]}`;
               if (await existFileLocal(`${fileTmp}`)) {
                  await deleteFolderLocal(dirFolder);
                  await saveFileLocal(fileTmp, dirFolder, scales, fitOption, compressOptions);
               }
            }
         } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
            if (!fileNameTrans[locale]) {
               deleteFolderCloud(dirFolder);
            } else if (fileNameTrans[locale]) {
               var fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileNameTrans[locale]}`;
               if (await existFileLocal(`${fileTmp}`)) {
                  deleteFolderCloud(dirFolder, [fileNameTrans[locale]]);
                  await saveFileCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
               }
            }
         } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
            if (!fileNameTrans[locale]) {
               deleteFolderGcCloud(dirFolder);
            } else if (fileNameTrans[locale]) {
               var fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileNameTrans[locale]}`;
               if (await existFileLocal(`${fileTmp}`)) {
                  deleteFolderGcCloud(dirFolder, [fileNameTrans[locale]]);
                  await saveFileGcCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
               }
            }
         }
      }),
   );

   return fileNameTrans;
}

export async function savePhotos(
   doc: any,
   field: string,
   collectionName: string,
   scales: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   const fileNames = (doc[field] || []).filter(Boolean);
   const dirFolder = `${collectionName}/${doc.id}/${field}`;

   if (fileNames) {
      //remove old file
      if (configUpload().FILESYSTEM_DRIVER == 'public') {
         fs.readdir(`${configUpload().PREFIX_UPLOAD}/${dirFolder}`, function (err, oldFileNames) {
            if (oldFileNames) {
               oldFileNames.forEach(function (oldFileName) {
                  const baseExt = extname(oldFileName);
                  const baseName = path.basename(oldFileName, baseExt).split('_')[0];
                  if (!fileNames.includes(`${baseName}${baseExt}`)) {
                     deleteFileLocal(`${configUpload().PREFIX_UPLOAD}/${dirFolder}/${oldFileName}`);
                  }
               });
            }
         });
      } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
         const s3 = await initCloud();
         const params = {
            Bucket: configUpload().DO_BUCKET,
            Prefix: `${configUpload().PREFIX_UPLOAD}/${dirFolder}`,
         };
         s3.listObjects(params, function (error, data) {
            if (data) {
               for (const index in data['Contents']) {
                  const oldFilePath = data['Contents'][index]['Key'];
                  if (oldFilePath) {
                     const baseExt = extname(oldFilePath);
                     const baseName = path.basename(oldFilePath, baseExt).split('_')[0];
                     if (!fileNames.includes(`${baseName}${baseExt}`)) {
                        s3.deleteObject(
                           {
                              Bucket: configUpload().DO_BUCKET,
                              Key: oldFilePath,
                           },
                           function (error, data) { },
                        );
                     }
                  }
               }
            }
         });
      } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
         const s3 = await initGcCloud();

         const [files] = await s3.getFiles({
            prefix: `${configUpload().PREFIX_UPLOAD}/${dirFolder}`,
         });
         files.forEach((file) => {
            console.log('For file upload', file);

            const oldFilePath = file.name;
            const baseExt = extname(oldFilePath);
            const baseName = path.basename(oldFilePath, baseExt).split('_')[0];
            if (!fileNames.includes(`${baseName}${baseExt}`)) {
               s3.file(oldFilePath).delete();
            }
         });
      }
      //save new file
      await Promise.all(
         fileNames.map(async function (fileName) {
            const fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileName}`;
            if (configUpload().FILESYSTEM_DRIVER == 'public') {
               if (fileName) {
                  // check exist file tmp
                  if (await existFileLocal(`${fileTmp}`)) {
                     await saveFileLocal(fileTmp, dirFolder, scales, fitOption, compressOptions);
                  }
               }
            } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
               if (fileName) {
                  // check exist file tmp
                  if (await existFileLocal(`${fileTmp}`)) {
                     await saveFileCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
                  }
               }
            } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
               if (fileName) {
                  // check exist file tmp
                  if (await existFileLocal(`${fileTmp}`)) {
                     await saveFileGcCloud(fileTmp, dirFolder, scales, fitOption, compressOptions);
                  }
               }
            }
         }),
      );
      return fileNames;
   } else {
      await deleteFolderLocal(dirFolder);
      return [];
   }
}

export async function saveFile(
   fileName: string,
   dirFile: string,
   scales: object = {},
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   const fileTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${fileName}`;
   if (configUpload().FILESYSTEM_DRIVER == 'public' && (await existFileLocal(`${fileTmp}`))) {
      return await saveFileLocal(fileTmp, dirFile, scales, fitOption, compressOptions);
   } else if (configUpload().FILESYSTEM_DRIVER == 'do' && (await existFileLocal(`${fileTmp}`))) {
      return await saveFileCloud(fileTmp, dirFile, scales, fitOption, compressOptions);
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc' && (await existFileLocal(`${fileTmp}`))) {
      return await saveFileGcCloud(fileTmp, dirFile, scales, fitOption, compressOptions);
   } else {
      return;
   }
}

export async function downloadThumb(
   res: any,
   doc: any,
   field: string,
   collectionName: string,
   scales?: object,
   fitOption?: string,
): Promise<{ status: boolean; res?: any }> {
   const fileName = doc[field];
   const dirFolder = `${collectionName}/${doc.id}/${field}`;
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      if (fileName == 'null') {
         return {
            status: false,
         };
      } else if (fileName) {
         return {
            status: true,
            res: res.download(`public/${configUpload().PREFIX_UPLOAD_URL}/${dirFolder}/${fileName}`),
         };
      }
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      if (fileName == 'null') {
         return {
            status: false,
         };
      } else if (fileName) {
         const s3 = await initCloud();
         const params = {
            Bucket: configUpload().DO_BUCKET,
            Key: `${configUpload().PREFIX_UPLOAD_URL}/${dirFolder}/${fileName}`,
         };
         return await s3
            .getObject(params)
            .promise()
            .then(async (data) => {
               const timestamp = Date.now();
               const baseExt = extname(fileName);
               const randomNameTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${timestamp}${randStr(5)}${baseExt}`;
               await writeFile(`${randomNameTmp}`, data.Body);
               return {
                  status: true,
                  res: res.download(`${randomNameTmp}`),
               };
            })
            .catch((err) => {
               return {
                  status: false,
               };
            });
      }
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      if (fileName == 'null') {
         return {
            status: false,
         };
      } else if (fileName) {
         const s3 = await initGcCloud();
         const download = await s3.file(fileName).download({
            destination: `${configUpload().PREFIX_UPLOAD_URL}/${dirFolder}/${fileName}`,
         });
         return {
            status: true,
            res: download,
         };
      }
   } else {
      return {
         status: false,
      };
   }
}

export function urlFile(fileName: string, dirFile: string, scale?: string): string {
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      var dirUrl = `${configUpload().NODE_URL}/${configUpload().PREFIX_UPLOAD_URL}/${dirFile}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      var dirUrl = `${configUpload().DO_URL}/${configUpload().PREFIX_UPLOAD_URL}/${dirFile}`;
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      var dirUrl = `${configUpload().GC_URL}/${configUpload().PREFIX_UPLOAD_URL}/${dirFile}`;
   }
   if (!scale) {
      //origin
      var fullUrl = `${dirUrl}/${fileName}`;
   } else {
      const baseExt = extname(fileName);
      const baseName = path.basename(fileName, baseExt);
      var fullUrl = `${dirUrl}/${baseName}_${scale}${baseExt}`;
   }
   // because hook not sync with method
   return fullUrl;
}

export function deleteFile(fileName: string, dirFile: string, scale?: string) {
   let filePath = `${configUpload().PREFIX_UPLOAD}/${dirFile}`;
   if (!scale) {
      //origin
      filePath += `/${fileName}`;
   } else {
      const baseExt = extname(fileName);
      const baseName = path.basename(fileName, baseExt);
      filePath = `/${baseName}_${scale}${baseExt}`;
   }

   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      return deleteFileLocal(filePath);
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      return deleteFileCloud(filePath);
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      return deleteFileGcCloud(filePath);
   } else {
      return;
   }
}

export async function listOfDir(dir: string, originDir?: string) {
   const list = [];
   const hasOriginDir = typeof originDir != 'undefined' ? true : false;
   const fullDir = trim(`${configUpload().PREFIX_UPLOAD}/${dir}`);
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      const files = await fsPromises.readdir(fullDir);
      if (!files) return list;
      await contentHelper.forEachAny(files, async function (file, index) {
         const stat = await fsPromises.stat(`${fullDir}/${file}`);
         if (!stat) return;
         //
         const size = Math.ceil(stat.size / 1024);
         const sizeText = `${size} KB`;
         const isFile2 = isFile(file) == null ? false : true;
         const isFileImage = await isImage(file);
         const isDir = stat.isDirectory();
         const nextDir = isDir ? (dir ? `${hasOriginDir ? originDir : dir}/${file}` : file) : null;
         const fullUrl = !isDir ? `${configUpload().NODE_URL}/${configUpload().PREFIX_UPLOAD_URL}/${dir}/${file}` : '';
         list.push({
            isDir: isDir,
            isFile: isFile2,
            isImage: isFileImage,
            currentDir: hasOriginDir ? originDir : dir,
            nextDir: nextDir,
            fullUrl: fullUrl,
            name: file,
            size: size,
            sizeText: sizeText,
            modifiedTime: moment(stat.mtime).format('YYYY-MM-DD hh:mm:ss'),
         });
      });
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      const s3 = await initCloud();
      const params = {
         Bucket: configUpload().DO_BUCKET,
         Prefix: fullDir,
      };
      const data = await s3.listObjects(params).promise();
      if (data['Contents'] && data['Contents'].length) {
         const files = data['Contents'];
         const uniqueFiles = [];
         const sizeFolders = {};
         await contentHelper.forEachAny(files, async function (file, index) {
            const keyFile = file['Key'];
            const lastModifiedFile = file['LastModified'];
            const sizeFile = file['Size'];
            // return filename or foldername
            let name = getFileNameFromPath(keyFile);
            // get prefix path except above name
            const prefix = keyFile.substring(0, keyFile.length - name.length);
            // check keyfile is folder path
            const isFolderKeyFile = isFile(keyFile) == null ? true : false;
            // check is folder: prefix path not equal fullDir or keyFile is folder
            const isDir = trim(prefix) != trim(fullDir) || isFolderKeyFile ? true : false;
            // if not folder then
            name = trim(!isDir || isFolderKeyFile ? name : prefix.substring(fullDir.length));
            //
            if ((isDir && name.indexOf('/') != -1) || fullDir == keyFile) return; // next folder
            //
            const size = Math.ceil(sizeFile / 1024);
            const sizeText = `${size} KB`;
            const isFile2 = isDir || isFile(keyFile) == null ? false : true;
            const isFileImage = isDir || !(await isImage(keyFile)) ? false : true;
            //
            let nextDir = isDir ? (dir ? `${hasOriginDir ? originDir : dir}/${name}` : name) : null;
            nextDir = nextDir ? trim(nextDir) : null;
            const fullUrl = !isDir ? `${configUpload().DO_URL}/${keyFile}` : '';
            //
            //
            if (isDir && typeof sizeFolders[name] != 'undefined') {
               sizeFolders[name] += size;
            } else if (isDir) {
               sizeFolders[name] = 0;
            }
            //
            if (uniqueFiles.includes(name)) {
               return;
            } else {
               uniqueFiles.push(name);
               list.push({
                  isDir: isDir,
                  isFile: isFile2,
                  isImage: isFileImage,
                  currentDir: hasOriginDir ? originDir : dir,
                  nextDir: nextDir,
                  fullUrl: fullUrl,
                  name: name,
                  size: size,
                  sizeText: sizeText,
                  modifiedTime: moment(lastModifiedFile).format('YYYY-MM-DD hh:mm:ss'),
               });
            }
         });

         list.map(function (file) {
            if (!file.isDir) return file;
            file['size'] = sizeFolders[file['name']];
            file['sizeText'] = `${sizeFolders[file['name']]} KB`;
            return file;
         });
      }
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      const s3 = await initGcCloud();
      const [files] = await s3.getFiles({
         prefix: fullDir,
      });
      const uniqueFiles = [];
      const sizeFolders = {};
      await contentHelper.forEachAny(files, async function (file, index) {
         const keyFile = file.name;
         const lastModifiedFile = file.metadata.updated;
         const sizeFile = file.metadata.size;
         // return filename or foldername
         let name = getFileNameFromPath(keyFile);
         // get prefix path except above name
         const prefix = keyFile.substring(0, keyFile.length - name.length);
         // check keyfile is folder path
         const isFolderKeyFile = isFile(keyFile) == null ? true : false;
         // check is folder: prefix path not equal fullDir or keyFile is folder
         const isDir = trim(prefix) != trim(fullDir) || isFolderKeyFile ? true : false;
         // if not folder then
         name = trim(!isDir || isFolderKeyFile ? name : prefix.substring(fullDir.length));
         //
         if ((isDir && name.indexOf('/') != -1) || fullDir == keyFile) return; // next folder
         //
         const size = Math.ceil(sizeFile / 1024);
         const sizeText = `${size} KB`;
         const isFile2 = isDir || isFile(keyFile) == null ? false : true;
         const isFileImage = isDir || !(await isImage(keyFile)) ? false : true;
         //
         let nextDir = isDir ? (dir ? `${hasOriginDir ? originDir : dir}/${name}` : name) : null;
         nextDir = nextDir ? trim(nextDir) : null;
         const fullUrl = !isDir ? `${configUpload().GC_URL}/${keyFile}` : '';
         //
         //
         if (isDir && typeof sizeFolders[name] != 'undefined') {
            sizeFolders[name] += size;
         } else if (isDir) {
            sizeFolders[name] = 0;
         }
         //
         if (uniqueFiles.includes(name)) {
            return;
         } else {
            uniqueFiles.push(name);
            list.push({
               isDir: isDir,
               isFile: isFile2,
               isImage: isFileImage,
               currentDir: hasOriginDir ? originDir : dir,
               nextDir: nextDir,
               fullUrl: fullUrl,
               name: name,
               size: size,
               sizeText: sizeText,
               modifiedTime: moment(lastModifiedFile).format('YYYY-MM-DD hh:mm:ss'),
            });
         }
      });

      list.map(function (file) {
         if (!file.isDir) return file;
         file['size'] = sizeFolders[file['name']];
         file['sizeText'] = `${sizeFolders[file['name']]} KB`;
         return file;
      });
   }
   return list;
}

export async function createFolder(folderName: string, dir: string): Promise<any> {
   folderName = folderName.replace(/\ +/g, '');
   let dirFolder = `${configUpload().PREFIX_UPLOAD}/${dir}/${folderName}`;
   dirFolder = dirFolder.replace(/\/+/g, '/');
   if (configUpload().FILESYSTEM_DRIVER == 'public') {
      return mkdirSync(dirFolder);
   } else if (configUpload().FILESYSTEM_DRIVER == 'do') {
      return await createFolderCloud(dirFolder);
   } else if (configUpload().FILESYSTEM_DRIVER == 'gc') {
      return await createFolderGcCloud(dirFolder);
   }
}

// ------------------------------------Process Local

export async function deleteFileLocal(filePath: string) {
   return fs.unlink(filePath, function (error, result) { });
}

export async function deleteFolderLocal(dirFolder: string) {
   dirFolder = `${configUpload().PREFIX_UPLOAD}/${dirFolder}`;
   const isExisted = await existFileLocal(dirFolder);
   if (isExisted) {
      return await fs.rmdirSync(dirFolder, { recursive: true });
   } else {
      return;
   }
}

export async function existFileLocal(destFile: string) {
   if (fs.existsSync(destFile)) {
      return true;
   } else {
      return false;
   }
}

// move from tmp to local
export async function saveFileLocal(
   src: string,
   dirDest: string,
   scales?: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   var dirDest = `${configUpload().PREFIX_UPLOAD}/${dirDest}`;
   const storageTmp = configUpload().PREFIX_UPLOAD_TMP;
   const compress = compressOptions ? Object.keys(compressOptions).length : false;
   const compressOut = `${storageTmp}/cpress`;
   const isImg = await isImage(src);
   const baseExt = extname(src);
   const baseName = path.basename(src, baseExt);
   const dest = `${dirDest}/${baseName}${baseExt}`;
   await mkdirSync(dirDest);
   if (isImg && compress) await compressImage(src, compressOut, compressOptions);
   if (isImg && compress) await fs.copyFile(`${compressOut}/${baseName}${baseExt}`, dest, function (error) { });
   else await fs.copyFile(src, dest, function (error) { });

   const scalesAr = Object.entries(scales);

   // resize image
   if (isImg && scales && Object.keys(scales).length > 0) {
      for (let index = 0; index < scalesAr.length; index++) {
         const scale = scalesAr[index];

         const width = parseInt(scale[1].split('x')[0]);
         const height = parseInt(scale[1].split('x')[1]);
         const baseNameScale = `${baseName}_${scale[1]}${baseExt}`;
         const tmpScale = `${storageTmp}/${baseNameScale}`;
         const destScale = `${dirDest}/${baseNameScale}`;
         if (!compress) {
            await resizeImage(dest, destScale, width, height, fitOption);
         } else {
            await resizeImage(dest, tmpScale, width, height, fitOption);
            await compressImage(tmpScale, compressOut, compressOptions);
            await fs.copyFile(`${compressOut}/${baseNameScale}`, destScale, function (error) { });
            fs.unlink(tmpScale, function (error) { });
         }
      }

      // await Promise.all(
      //    Object.keys(scales).map(async function (index) {
      //       const width = parseInt(scales[index].split('x')[0]);
      //       const height = parseInt(scales[index].split('x')[1]);
      //       const baseNameScale = `${baseName}_${scales[index]}${baseExt}`;
      //       const tmpScale = `${storageTmp}/${baseNameScale}`;
      //       const destScale = `${dirDest}/${baseNameScale}`;
      //       if (!compress) {
      //          await resizeImage(dest, destScale, width, height, fitOption);
      //       } else {
      //          await resizeImage(dest, tmpScale, width, height, fitOption);
      //          await compressImage(tmpScale, compressOut, compressOptions);
      //          await fs.copyFile(`${compressOut}/${baseNameScale}`, destScale, function (error) {});
      //          fs.unlink(tmpScale, function (error) {});
      //       }
      //    }),
      // );
   }
   return `${baseName}${baseExt}`;
}

////----------------------------------------------

// ------------------------------------DO Cloud

export async function initCloud() {
   const spacesEndpoint = new AWS.Endpoint(configUpload().DO_ENDPOINT);
   return new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: configUpload().DO_ACCESS_KEY_ID,
      secretAccessKey: configUpload().DO_SECRET_ACCESS_KEY,
   });
}

export async function deleteFileCloud(filePath: string) {
   const s3 = await initCloud();
   return s3.deleteObject(
      {
         Bucket: configUpload().DO_BUCKET,
         Key: filePath,
      },
      function (error, data) { },
   );
}

export async function deleteFolderCloud(dirFolder: string, exceptFiles: Array<string> = []) {
   var dirFolder = `${configUpload().PREFIX_UPLOAD}/${dirFolder}`;
   const s3 = await initCloud();
   const params = {
      Bucket: configUpload().DO_BUCKET,
      Prefix: dirFolder,
   };
   return s3.listObjects(params, function (error, data) {
      if (data) {
         for (const index in data['Contents']) {
            const oldFile = data['Contents'][index]['Key'];
            const baseExt = extname(oldFile);
            const baseName = path.basename(oldFile, baseExt);
            const oldFileName = `${baseName}${baseExt}`;
            if (oldFile && exceptFiles.indexOf(oldFileName) == -1) {
               s3.deleteObject(
                  {
                     Bucket: configUpload().DO_BUCKET,
                     Key: oldFile,
                  },
                  function (error, data) { },
               );
            }
         }
      }
   });
}

export async function createFolderCloud(dirFolder: string) {
   const s3 = await initCloud();
   const params = {
      Bucket: configUpload().DO_BUCKET,
      Key: dirFolder,
   };
   return s3
      .putObject(params)
      .on('build', (request) => {
         request.httpRequest.headers['x-amz-acl'] = 'public-read';
      })
      .promise();
}

export async function uploadToCloud(src: string, dest: string) {
   const s3 = await initCloud();
   const readStream = fs.createReadStream(src);
   const params = {
      Body: readStream,
      Bucket: configUpload().DO_BUCKET,
      Key: dest,
   };
   return s3
      .putObject(params)
      .on('build', (request) => {
         request.httpRequest.headers['Content-Type'] = mime.getType(src);
         request.httpRequest.headers['x-amz-acl'] = 'public-read';
      })
      .promise();
}

export async function saveFileCloud(
   src: string,
   dirDest: string,
   scales?: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   const storageTmp = configUpload().PREFIX_UPLOAD_TMP;
   const compress = compressOptions ? Object.keys(compressOptions).length : false;
   const compressOut = `${storageTmp}/cpress`;
   const isImg = await isImage(src);

   const baseExt = extname(src);
   const baseName = path.basename(src, baseExt);
   const dest = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseName}${baseExt}`;

   if (isImg && compress) await compressImage(src, compressOut, compressOptions);
   if (compress) {
      await uploadToCloud(`${compressOut}/${baseName}${baseExt}`, dest);
      fs.unlink(`${compressOut}/${baseName}${baseExt}`, function (error) { });
   } else await uploadToCloud(src, dest);

   const lastLoop = scales ? Object.keys(scales).slice(-1)[0] : 0;

   const scalesAr = Object.entries(scales);

   if ((await isImage(src)) && scales && Object.keys(scales).length > 0) {
      for (let index = 0; index < scalesAr.length; index++) {
         const scale = scalesAr[index];

         const width = parseInt(scale[1].split('x')[0]);
         const height = parseInt(scale[1].split('x')[1]);
         const baseNameScale = `${baseName}_${scale[1]}${baseExt}`;
         const destScaleTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${baseNameScale}`;
         const destScale = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseNameScale}`;
         if (!compress) {
            await resizeImage(src, destScaleTmp, width, height, fitOption);
            await uploadToCloud(destScaleTmp, destScale);
            fs.unlink(destScaleTmp, function (error) { });
         } else {
            await resizeImage(src, destScaleTmp, width, height, fitOption);
            await compressImage(destScaleTmp, compressOut, compressOptions);
            await uploadToCloud(`${compressOut}/${baseNameScale}`, destScale);
            fs.unlink(destScaleTmp, function (error) { });
            fs.unlink(`${compressOut}/${baseNameScale}`, function (error) { });
         }
         if (lastLoop == index) fs.unlink(src, function (error) { });
      }
      // await Promise.all(
      //    Object.keys(scales).map(async function (index) {
      //       const width = parseInt(scales[index].split('x')[0]);
      //       const height = parseInt(scales[index].split('x')[1]);
      //       const baseNameScale = `${baseName}_${scales[index]}${baseExt}`;
      //       const destScaleTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${baseNameScale}`;
      //       const destScale = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseNameScale}`;
      //       if (!compress) {
      //          await resizeImage(src, destScaleTmp, width, height, fitOption);
      //          await uploadToCloud(destScaleTmp, destScale);
      //          fs.unlink(destScaleTmp, function (error) {});
      //       } else {
      //          await resizeImage(src, destScaleTmp, width, height, fitOption);
      //          await compressImage(destScaleTmp, compressOut, compressOptions);
      //          await uploadToCloud(`${compressOut}/${baseNameScale}`, destScale);
      //          fs.unlink(destScaleTmp, function (error) {});
      //          fs.unlink(`${compressOut}/${baseNameScale}`, function (error) {});
      //       }
      //       if (lastLoop == index) fs.unlink(src, function (error) {});
      //    }),
      // );
   } else {
      fs.unlink(src, function (error) { });
   }
   return `${baseName}${baseExt}`;
}

// ------------------------------------GC Cloud

export async function initGcCloud() {
   const bucketName = configUpload().GC_BUCKET;
   const storage = new Storage();
   return await storage.bucket(bucketName);
}

export async function deleteFileGcCloud(filePath: string) {
   const s3 = await initGcCloud();
   if (!s3) {
      return false;
   }
   try {
      s3.file(filePath).delete();
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
}

export async function deleteFolderGcCloud(dirFolder: string, exceptFiles: Array<string> = []) {
   const s3 = await initGcCloud();
   const [files] = await s3.getFiles({
      prefix: `${configUpload().PREFIX_UPLOAD}/${dirFolder}/`,
   });
   try {
      files.forEach((file) => {
         const oldFile = file.name;
         const baseExt = extname(oldFile);
         const baseName = path.basename(oldFile, baseExt);
         const oldFileName = `${baseName}${baseExt}`;
         if (oldFile && exceptFiles.indexOf(oldFileName) == -1) {
            try {
               s3.file(oldFile).delete();
            } catch (error) {
               console.log(error);
            }
         }
      });
   } catch (error) {
      console.log(error);
   }
}

export async function createFolderGcCloud(dirFolder: string) {
   await mkFileSync(`${configUpload().PREFIX_UPLOAD_TMP}/emptyFile.txt`);
   const s3 = await initGcCloud();
   return await s3.upload(`${configUpload().PREFIX_UPLOAD_TMP}/emptyFile.txt`, {
      gzip: true,
      destination: `${dirFolder}/emptyFile.txt`,
      metadata: {
         cacheControl: 'public, max-age=31536000',
      },
   });
}

export async function uploadToGcCloud(src: string, dest: string) {
   const s3 = await initGcCloud();
   return await s3.upload(src, {
      gzip: true,
      destination: dest,
      metadata: {
         cacheControl: 'public, max-age=31536000',
      },
   });
}

export async function saveFileGcCloud(
   src: string,
   dirDest: string,
   scales?: object,
   fitOption?: string,
   compressOptions?: compressOptionInterface,
) {
   console.log('asdasdasdasd', src);

   const storageTmp = configUpload().PREFIX_UPLOAD_TMP;
   const compress = compressOptions ? Object.keys(compressOptions).length : false;
   const compressOut = `${storageTmp}/cpress`;
   const isImg = await isImage(src);

   const baseExt = extname(src);
   const baseName = path.basename(src, baseExt);
   const dest = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseName}${baseExt}`;

   if (isImg && compress) await compressImage(src, compressOut, compressOptions);
   if (compress) {
      await uploadToGcCloud(`${compressOut}/${baseName}${baseExt}`, dest);
      fs.unlink(`${compressOut}/${baseName}${baseExt}`, function (error) { });
   } else await uploadToGcCloud(src, dest);

   const lastLoop = scales ? Object.keys(scales).slice(-1)[0] : 0;

   const scalesAr = Object.entries(scales);

   if ((await isImage(src)) && scales && Object.keys(scales).length > 0) {
      for (let index = 0; index < scalesAr.length; index++) {
         const scale = scalesAr[index];

         const width = parseInt(scale[1].split('x')[0]);
         const height = parseInt(scale[1].split('x')[1]);
         const baseNameScale = `${baseName}_${scale[1]}${baseExt}`;
         const destScaleTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${baseNameScale}`;
         const destScale = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseNameScale}`;
         if (!compress) {
            await resizeImage(src, destScaleTmp, width, height, fitOption);
            await uploadToGcCloud(destScaleTmp, destScale);
            fs.unlink(destScaleTmp, function (error) { });
         } else {
            await resizeImage(src, destScaleTmp, width, height, fitOption);
            await compressImage(destScaleTmp, compressOut, compressOptions);
            await uploadToGcCloud(`${compressOut}/${baseNameScale}`, destScale);
            fs.unlink(destScaleTmp, function (error) { });
            fs.unlink(`${compressOut}/${baseNameScale}`, function (error) { });
         }
         if (lastLoop == index) fs.unlink(src, function (error) { });
      }
      // await Promise.all(
      //    Object.keys(scales).map(async function (index) {
      //       const width = parseInt(scales[index].split('x')[0]);
      //       const height = parseInt(scales[index].split('x')[1]);
      //       const baseNameScale = `${baseName}_${scales[index]}${baseExt}`;
      //       const destScaleTmp = `${configUpload().PREFIX_UPLOAD_TMP}/${baseNameScale}`;
      //       const destScale = `${configUpload().PREFIX_UPLOAD}/${dirDest}/${baseNameScale}`;
      //       if (!compress) {
      //          await resizeImage(src, destScaleTmp, width, height, fitOption);
      //          await uploadToGcCloud(destScaleTmp, destScale);
      //          fs.unlink(destScaleTmp, function (error) {});
      //       } else {
      //          await resizeImage(src, destScaleTmp, width, height, fitOption);
      //          await compressImage(destScaleTmp, compressOut, compressOptions);
      //          await uploadToGcCloud(`${compressOut}/${baseNameScale}`, destScale);
      //          fs.unlink(destScaleTmp, function (error) {});
      //          fs.unlink(`${compressOut}/${baseNameScale}`, function (error) {});
      //       }
      //       if (lastLoop == index) fs.unlink(src, function (error) {});
      //    }),
      // );
   } else {
      fs.unlink(src, function (error) { });
   }
   return `${baseName}${baseExt}`;
}

//------------------------------------------------
export async function getAllLinkFileDO() {
   const fullDir = trim(`${configUpload().PREFIX_UPLOAD}/`);
   const s3 = await initCloud();
   const params = {
      Bucket: configUpload().DO_BUCKET,
      Prefix: fullDir,
   };
   const data = await s3.listObjects(params).promise();
   const files = data['Contents'] as Array<object>;
   const fileURLs = [];
   files.map((item, index) => {
      fileURLs.push(`${configUpload().DO_URL}/${item['Key']}`);
   });
   return fileURLs;
}
