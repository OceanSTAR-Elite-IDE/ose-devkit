import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { NC_VALIDATION_TRANSFOMER, NcValidationTransformer } from './form-validation';

@Pipe({ name: 'formError' })
export class NcFormErrorPipe implements PipeTransform {
  constructor(@Inject(NC_VALIDATION_TRANSFOMER) private _transformer: NcValidationTransformer) {}

  transform(value: ValidationErrors | null, ...args: any[]) {
    if (!value) {
      return '';
    }

    return this._transformer.transform(value, ...args);
  }
}
