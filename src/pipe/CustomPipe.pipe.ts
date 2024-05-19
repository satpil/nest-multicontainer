import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CustomError } from 'src/filter/Error';
import * as yup from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private readonly schema: yup.ObjectSchema<any>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await this.schema.validate(value);
      return value;
    } catch (error) {
        throw new CustomError(error,404)
    }
  }
}