import { forwardRef, Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '../email/email.module';
// import { tokenDrawModule } from '../tokenDraw/tokenDraw.module';
import { CommonConsumerService } from './services/common.consumer.service';
import { CommonProducerService } from './services/common.producer.service';
import { MarketingMailProducerService } from './services/marketingMail.producer.service';
import { MarketingMailConsumerService } from './services/marketingMail.consumer.service';

@Module({
   imports: [
      SchemasModule,
      // forwardRef(() => tokenDrawModule),
      BullModule.forRootAsync({
         useFactory: () => ({
            redis: {
               host: process.env.REDIS_HOST,
               port: parseInt(process.env.REDIS_PORT),
               username: process.env.REDIS_USERNAME,
               password: process.env.REDIS_PASSWORD,
               keyPrefix: `queue${process.env.REDIS_PREFIX}`,
            },
         }),
         inject: [],
      }),
      EmailModule,
      BullModule.registerQueue({ name: 'common' }),
      BullModule.registerQueue({ name: 'marketingMail' }),
   ],
   controllers: [],
   providers: [CommonProducerService, CommonConsumerService, MarketingMailProducerService, MarketingMailConsumerService],
   exports: [CommonProducerService, CommonConsumerService, MarketingMailProducerService, MarketingMailConsumerService],
})
export class QueueModule {}
