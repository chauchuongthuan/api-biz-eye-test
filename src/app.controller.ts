import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppService } from './app.service';
import { HelperService } from './core/services/helper.service';
import { Role } from './schemas/role.schemas';
import { User } from './schemas/user/user.schemas';
import { Setting } from './schemas/setting.schemas';

@Controller()
export class AppController {
   constructor(
      private readonly appService: AppService,
      @InjectModel(User.name) private user: Model<User>,
      @InjectModel(Role.name) private role: Model<Role>,
      @InjectModel(Setting.name) private setting: Model<Setting>,
      private helperService: HelperService,
   ) {}

   @Get()
   getHello(): string {
      return this.appService.getHello();
   }
   private seedNames: Array<string>;
   @Get('seed')
   async generateData(): Promise<string> {
      this.seedNames = [];

      /*
        Role Seeder
         */
      await this.roleSeeder();

      /*
        User Seeder
         */
      await this.userSeeder();

      /*
        Setting Seeder
         */
      await this.seedAccess();

      /*
        Page Seeder
         */
      //await this.seedPage();

      if (this.seedNames.length) {
         return this.seedNames
            .map((name) => {
               return `Seeded ${name}`;
            })
            .join('\n');
      } else {
         return 'No seeder';
      }
   }

   private async roleSeeder() {
      const role = await this.role.findOne();
      if (!role) {
         const data: Record<any, any> = {
            name: 'admin',
            isAdmin: true,
         };

         await new this.role(data).save();
         this.seedNames.push('Role');
      }
   }

   private async userSeeder() {
      const user = await this.user.findOne();
      if (!user) {
         const role = await this.role.findOne({
            isAdmin: true,
         });

         const password = await this.helperService.hash('Hjs3n$8aV');
         await new this.user({
            name: 'Wearetopgroup',
            email: 'admin@wearetopgroup.com',
            password: password,
            role: role._id,
            active: true,
         }).save();
         this.seedNames.push('User');
      }
   }

   private async seedAccess() {
      var seedNames = [];
      var defaultAccesses = [
         {
            name: 'access',
            value: '0',
         },
         {
            name: 'accessByMonth',
            value: '0',
         },
         {
            name: 'accessByMinute',
            value: '0',
         },
         {
            name: 'accessByWindow',
            value: '0',
         },
         {
            name: 'accessByMobile',
            value: '0',
         },
      ];

      if (defaultAccesses) {
         var self = this;
         defaultAccesses.forEach(async function (defaultAccess) {
            const access = await self.setting.findOne({ name: defaultAccess.name });
            if (!access) {
               seedNames.push(defaultAccess.name);
               await self.setting.insertMany([defaultAccess]);
            }
         });
      }
      return 'Success';
   }
}
