import { Body, Controller, Get, Post, Delete, UploadedFiles, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { convertContentFileDto } from '@core/helpers/content';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ResponseService } from '@core/services/response.service';
import { Permissions } from '@core/services/permission.service';
import { ACL } from '@common/auth/decorators/acl.decorator';
import * as fileHelper from '@core/helpers/file';

@ApiTags('Admin/FileManager')
@Controller('admin/filemanagers')
@UserSecure()
export class BeFileManagerController {
   private prefixFilemanager;
   private allowedFiles;
   private allowedFileSize;

   constructor(private response: ResponseService) {
      this.prefixFilemanager = process.env.PREFIX_FILE_MANAGER;
      this.allowedFiles = 'svg|jpg|jpeg|png|gif|plain|msword|document|ms-excel|sheet|ms-powerpoint|presentation|csv';
      this.allowedFileSize = 5;
   }

   @Get()
   @ACL(Permissions.file_manager_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const currentDir = fileHelper.cleanPath(query.currentDir || '');
      const dir = `${this.prefixFilemanager}/${currentDir}`;
      const listFile = await fileHelper.listOfDir(dir, currentDir);
      return {
         status: true,
         data: {
            currentDir: dir,
            listFile: listFile,
         },
      };
   }

   @Post()
   @HasFile()
   @ACL(Permissions.file_manager_add)
   async create(@UploadedFiles() files, @Body() body): Promise<any> {
      const currentDir = fileHelper.cleanPath(body.currentDir || '');
      const dir = fileHelper.trimRight(`${this.prefixFilemanager}/${currentDir}`);
      const myFiles = {
         files: '' || [],
      };
      await convertContentFileDto(myFiles, files, ['files'], {
         files: `exts:${this.allowedFiles};size:${this.allowedFileSize}`,
      });
      if (myFiles.files.length) {
         await Promise.all(
            myFiles.files.map(async function (fileName) {
               await fileHelper.saveFile(fileName, dir);
            }),
         );
      }
      return {
         status: true,
      };
   }

   @Post('single')
   @HasFile()
   @ACL(Permissions.file_manager_add)
   async uploadSingle(@UploadedFiles() files, @Body() body): Promise<any> {
      const myFiles = {
         upload: '',
      };
      await convertContentFileDto(myFiles, files, ['upload'], {
         file: `exts:${this.allowedFiles};size:${this.allowedFileSize}`,
      });
      const dirFile = this.prefixFilemanager;
      const fileName = myFiles.upload;
      await fileHelper.saveFile(fileName, dirFile);
      return {
         uploaded: true,
         fileName: fileName,
         url: fileHelper.urlFile(fileName, dirFile),
      };
   }

   @Post('folders')
   @HasFile()
   @ACL(Permissions.file_manager_add)
   async createFolder(@UploadedFiles() files, @Body() body): Promise<any> {
      const currentDir = fileHelper.cleanPath(body.currentDir || '');
      const dir = `${this.prefixFilemanager}/${currentDir}`;
      const folderName = fileHelper.cleanPath(body.folderName || '');
      await fileHelper.createFolder(folderName, dir);
      return {
         status: true,
      };
   }

   @Delete('file-folders')
   @HasFile()
   @ACL(Permissions.file_manager_delete)
   async deleteFileFolders(@UploadedFiles() files, @Body() body): Promise<any> {
      const currentDir = fileHelper.cleanPath(body.currentDir || '');
      const dir = fileHelper.trim(`${this.prefixFilemanager}/${currentDir}`);
      const fileNames = body.fileNames || '';
      const folderNames = body.folderNames || '';
      if (fileNames.length >= 1) {
         await Promise.all(
            fileNames.map(async function (filename) {
               filename = fileHelper.trim(fileHelper.cleanPath(filename));
               await fileHelper.deleteFile(filename, dir);
            }),
         );
      }
      if (folderNames.length >= 1) {
         await Promise.all(
            folderNames.map(async function (folderName) {
               folderName = fileHelper.trim(fileHelper.cleanPath(folderName));
               await fileHelper.deleteFolder(`${dir}/${folderName}`);
            }),
         );
      }
      return {
         status: true,
      };
   }
}
