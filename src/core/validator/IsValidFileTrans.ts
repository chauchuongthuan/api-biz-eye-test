import {
   registerDecorator,
   ValidationArguments,
   ValidationOptions,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
import { Languages } from '@schemas/utils/multiLanguageProp';

@ValidatorConstraint({ async: true })
export class IsValidFileTransConstraint implements ValidatorConstraintInterface {
   validate(value: Record<any, any> | string, args: ValidationArguments): boolean {
      return validationRule(args);
   }

   defaultMessage(args: ValidationArguments): string {
      return validationRule(args, true);
   }
}

export function IsValidFileTrans(constraints: string[], validationOptions?: ValidationOptions) {
   return function (object: Record<any, any>, propertyName: string): void {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: constraints,
         validator: IsValidFileTransConstraint,
      });
   };
}

const validationRule = function (args: ValidationArguments, isMsg = false): any {
   const langs = Languages;
   let result: any = true;
   const value = args.value;
   const propName = args.property;
   const validations = {};
   const constraints = args.constraints;
   let transFile = 'validation.attributes.';
   if (constraints && constraints.length) {
      constraints.forEach(function (constraint) {
         const [name, rule, value] = constraint.split(':');
         if (name == 'transFile') {
            transFile = `${rule}.`;
         } else if (langs.indexOf(name) != -1) {
            validations[name] = validations[name] || {};
            validations[name][rule] = value;
         } else {
            langs.forEach(function (lang) {
               validations[lang] = validations[lang] || {};
               validations[lang][name] = rule;
            });
         }
      });
   } else {
      langs.forEach(function (lang) {
         validations[lang] = {
            required: 'true',
            maxlength: '255',
         };
      });
   }

   if (!value) {
      return isMsg ? `|validation.required|attribute:${transFile}${propName}` : false;
   }

   Object.keys(value).forEach(async function (lang) {
      if (!langs.includes(lang)) {
         result = isMsg ? `|validation.invalidTrans|attribute:${transFile}${propName};lang:(${lang})` : false;
      }
   });

   return result;
};
