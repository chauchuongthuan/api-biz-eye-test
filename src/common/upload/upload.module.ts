import { Module } from '@nestjs/common';
import { BeFileManagerController } from './admin/beFileManager.controller';

@Module({
   imports: [],
   controllers: [BeFileManagerController],
   providers: [],
})
export class UploadModule {}
