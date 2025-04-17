import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import sanitize from 'mongo-sanitize';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return sanitize(value);
  }
}