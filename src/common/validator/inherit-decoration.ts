import { getMetadataStorage, registerDecorator } from "class-validator";

export function InheritParentDecorators() {
    return (
      target: any,
      propertyKey: string,
    ) => {
      const storage = getMetadataStorage();
      const parent = Object.getPrototypeOf(target.constructor);
  
      if (!parent) {
        return;
      }
  
      const targetMetadatas = storage.getTargetValidationMetadatas(
        parent,
        parent.name,
        false,
        false,
      );
  
      targetMetadatas
        .filter(e => e.propertyName === propertyKey)
        .forEach(e => {
          registerDecorator({
            name: e.type,
            target: target.constructor,
            propertyName: e.propertyName,
            // preserving custom error messages (thanks [slavco86](https://github.com/slavco86))
            options: {...e.validationTypeOptions, message: e.message},
            constraints: e.constraints,
            validator: e.constraintCls,
          });
        });
    };
  }