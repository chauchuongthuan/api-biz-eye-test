export class CustomerBasicEvent {
   public customerID;
   public eventEntity;
   public eventEmitter;
   public payload;

   constructor(customerID: number, eventEntity: string, eventEmitter: number, payload?: object) {
      this.customerID = customerID;
      this.eventEntity = eventEntity;
      this.eventEmitter = eventEmitter;
      this.payload = payload;
   }
}

export class CustomerBannedEvent {
   public customerID;
   public eventEntity;
   public eventEmitter;
   public newState;

   constructor(customerID: number, eventEntity: string, eventEmitter: number, newState: boolean) {
      this.customerID = customerID;
      this.eventEntity = eventEntity;
      this.eventEmitter = eventEmitter;
      this.newState = newState;
   }
}

export class CustomerStateEvent {
   public customerID;
   public eventEntity;
   public eventEmitter;
   public newState;

   constructor(customerID: number, eventEntity: string, eventEmitter: number, newState: boolean) {
      this.customerID = customerID;
      this.eventEntity = eventEntity;
      this.eventEmitter = eventEmitter;
      this.newState = newState;
   }
}

export class CustomerOrderSuccessEvent {
   public order;
   public customerID;
   public eventEntity;
   public eventEmitter;
   public payload;

   constructor(
      order: { id: number; total: number },
      customerID: number,
      eventEntity: string,
      eventEmitter: number,
      payload?: object,
   ) {
      this.order = order;
      this.customerID = customerID;
      this.eventEntity = eventEntity;
      this.eventEmitter = eventEmitter;
      this.payload = payload;
   }
}
