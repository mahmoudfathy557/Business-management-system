import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToNullPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    this.convertEmptyStringsToNull(value);
    return value;
  }

  private convertEmptyStringsToNull(obj: any) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] === '') {
          obj[key] = null;
        } else if (typeof obj[key] === 'object') {
          // Recursively call for nested objects
          this.convertEmptyStringsToNull(obj[key]);
        }
      }
    }
  }
}
