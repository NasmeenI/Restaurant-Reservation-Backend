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
