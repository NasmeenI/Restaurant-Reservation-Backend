import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import sanitize from 'mongo-sanitize';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // MongoDB sanitization (clean NoSQL queries)
    const sanitizedMongoValue = sanitize(value);

    // XSS sanitization (clean HTML/JS injection)
    if (typeof sanitizedMongoValue === 'string') {
      return sanitizeHtml(sanitizedMongoValue, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }

    return sanitizedMongoValue;
  }
}