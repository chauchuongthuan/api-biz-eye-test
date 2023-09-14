import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeCategoryController } from './admin/beCategory.controller';
import { CategoryService } from './services/category.service';
import { TransformerCategoryService } from './services/transformerCategory.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeCategoryController],
   providers: [CategoryService, TransformerCategoryService],
   exports: [CategoryService, TransformerCategoryService],
})
export class CategoryModule {}
