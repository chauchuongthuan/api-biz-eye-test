import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
const moment = require('moment');

@ValidatorConstraint({ async: true })
export class MyDateConstraint implements ValidatorConstraintInterface {
   validate(value: Record<any, any> | string, args: ValidationArguments): boolean {
      return validationRule(args);
   }

   defaultMessage(args: ValidationArguments): string {
      return validationRule(args, true);
   }
}

export function MyDate(constraints: string[], validationOptions?: ValidationOptions) {
   return function (object: Record<any, any>, propertyName: string): void {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: constraints,
         validator: MyDateConstraint,
      });
   };
}

const validationRule = function (args: ValidationArguments, isMsg = false): any {
   let result: any = true;
   const value = args.value;
   const format = args.constraints[0] || 'YYYY-MM-DD';
   if (!moment(moment(value).format(format), format, true).isValid()) {
      result = isMsg ? `Ngày không hợp lệ!` : false;
   }
   return result;
};
