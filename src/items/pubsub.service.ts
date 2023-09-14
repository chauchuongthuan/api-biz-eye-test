import { Inject, Injectable } from '@nestjs/common';
import pubSub from './pubSub.constant';

@Injectable()
export class PubSubService {
   constructor() {}

   publishPubSub(name: string, data: any) {
      console.log('data PUB::', data);
      pubSub.publish(name, data);
   }
   asyncIterator(name: string) {
      return pubSub.asyncIterator(name);
   }
}
