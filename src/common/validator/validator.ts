import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOpenBeforeClose(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isOpenBeforeClose',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (typeof value !== 'string' || typeof relatedValue !== 'string')
            return false;

          // Convert "HH.MM" → number of minutes since midnight
          const toMinutes = (time: string) => {
            const [h, m] = time.split('.').map(Number);
            return h * 60 + m;
          };

          return toMinutes(value) < toMinutes(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be earlier than ${args.constraints[0]}`;
        },
      },
    });
  };
}

export function IsStartBeforeEnd(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedProperty],
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Ensure both values are valid Date objects
          if (!(value instanceof Date) || isNaN(value.getTime())) {
            return false; // Invalid start date
          }
          if (
            !(relatedValue instanceof Date) ||
            isNaN(relatedValue.getTime())
          ) {
            return false; // Invalid end date
          }

          // Check if startTime is before endTime (strictly less than)
          return value.getTime() < relatedValue.getTime();
        },
        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be earlier than ${relatedPropertyName}`;
        },
      },
    });
  };
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          if (!(value instanceof Date)) return false; // Not a valid date
          return value.getTime() > Date.now(); // Check if the date is in the future
        },
        defaultMessage(): string {
          return `${propertyName} must be in the future`;
        },
      },
    });
  };
}
