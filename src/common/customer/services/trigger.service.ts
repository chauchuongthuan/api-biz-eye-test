import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { REQUEST } from '@nestjs/core';
import {
   CustomerBasicEvent,
   CustomerBannedEvent,
   CustomerStateEvent,
   CustomerOrderSuccessEvent,
} from '@common/customer/triggers/events/customer.event';

@Injectable()
export class TriggerService {
   private user;

   constructor(private eventEmitter: EventEmitter2, @Inject(REQUEST) private request: any) {
      this.user = this.request.user;
   }

   async login(customerID: number): Promise<boolean> {
      return this.eventEmitter.emit('customer.login', new CustomerBasicEvent(customerID, 'Customer', customerID));
   }

   async updateProfile(customerID: number, payload: object): Promise<boolean> {
      return this.eventEmitter.emit('customer.profile', new CustomerBasicEvent(customerID, 'Customer', customerID, payload));
   }

   async updateProfileByUser(customerID: number, payload: object): Promise<boolean> {
      return this.eventEmitter.emit('customer.profile', new CustomerBasicEvent(customerID, 'User', this.user.id, payload));
   }

   async updateState(customerID: number, newState: boolean): Promise<boolean> {
      return this.eventEmitter.emit('customer.state', new CustomerStateEvent(customerID, 'User', this.user.id, newState));
   }

   async banned(customerID: number, newState: boolean): Promise<boolean> {
      return this.eventEmitter.emit('customer.banned', new CustomerBannedEvent(customerID, 'User', this.user.id, newState));
   }

   async tags(customerID: number, payload: object): Promise<boolean> {
      return this.eventEmitter.emit('customer.tags', new CustomerBasicEvent(customerID, 'User', this.user.id, payload));
   }

   async deleteByUser(customerID: number): Promise<boolean> {
      return this.eventEmitter.emit('customer.delete', new CustomerBasicEvent(customerID, 'User', this.user.id));
   }

   async confirmOrderSuccess(order: { id: number; total: number }, customerID: number, payload: object): Promise<boolean> {
      return this.eventEmitter.emit(
         'customer.order.success',
         new CustomerOrderSuccessEvent(order, customerID, 'Customer', customerID, payload),
      );
   }
}
