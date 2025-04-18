// swagger-partial-type.plugin.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SchemaObject, ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function applyPartialTypeMetadata(app, document: any) {
  const schemas = document.components.schemas;

  // Iterate over all schemas
  for (const schemaName in schemas) {
    const schema: SchemaObject | ReferenceObject = schemas[schemaName];

    // Skip if schema is a ReferenceObject (e.g., $ref)
    if ('$ref' in schema) {
      continue;
    }

    // Check if the schema is an Update DTO (based on naming convention)
    if (schemaName.includes('Update') && (schema as SchemaObject).properties) {
      // Assume the parent schema is the "Create" version (e.g., CreateRestaurantRequest)
      const parentSchemaName = schemaName.replace('Update', 'Create');
      const parentSchema: SchemaObject | ReferenceObject = schemas[parentSchemaName];

      // Skip if parent schema is a ReferenceObject or does not exist
      if (!parentSchema || '$ref' in parentSchema) {
        continue;
      }

      // Ensure the schema is treated as a SchemaObject
      const schemaObject = schema as SchemaObject;
      const parentSchemaObject = parentSchema as SchemaObject;

      // Copy properties from the parent schema
      if (parentSchemaObject.properties) {
        schemaObject.properties = { ...parentSchemaObject.properties };

        // Mark all fields as optional by clearing the required array
        schemaObject.required = [];

        // Update each property to indicate it's not required
        for (const propName in schemaObject.properties) {
          const property = schemaObject.properties[propName];
          // Remove required flag from individual properties (if any)
          if ('required' in property) {
            delete property.required;
          }
        }
      }
    }
  }

  return document;
}