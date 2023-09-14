import {
   Body,
   Controller,
   Get,
   Post,
   Put,
   Delete,
   Request,
   UseInterceptors,
   UploadedFiles,
   Param,
   Query,
   UseGuards,
} from '@nestjs/common';
import { TransformerCustomerService } from '@common/customer/services/transformerCustomer.service';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ContactService } from '../services/contact.service';
import { TransformerContactService } from '../services/transformerContact.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeContactDto } from '../dto/beContact.dto';

@ApiTags('Admin/Contacts')
@Controller('admin/contacts')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeContactController {
   constructor(
      private contactService: ContactService,
      private transformer: TransformerContactService,
      private response: ResponseService,
   ) {}

   // Find list contacts
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.contact_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.contactService.findAll(query);
      if (query.get && query.export) return this.transformer.transformContactExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformContactList(items));
   }

   // Create a new contact

   @Post()
   @ApiBody({ type: BeContactDto })
   @ACL(Permissions.contact_add)
   @HasFile()
   async create(@Body() dto: BeContactDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.contactService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformContactDetail(item));
   }

   // Update contact

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.contact_edit)
   async update(@Param('id') id: string, @Body() dto: BeContactDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.contactService.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformContactDetail(item));
   }

   // Delete contact

   @Delete()
   @ACL(Permissions.contact_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.contactService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get contact by Id

   @Get(':id')
   @ACL(Permissions.contact_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const contact = await this.contactService.detail(id);
      if (!contact) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformContactDetail(contact));
   }
}
