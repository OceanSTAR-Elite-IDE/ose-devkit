import { Injectable, InjectionToken } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export const DEFAULT_TEMPLATES = {
  required: 'Please enter {0}',
  email: '{0} is not a valid email format',
  min: '{0} must be greater than {1}',
  max: '{0} must be less than {1}',
  pattern: '{0} is not valid data',
  maxlength: '{0} maximum length is {1}',
  minlength: '{0} minimum length is {1}',

  selection: 'Please select {0}',
  upload: 'Please upload {0}',
  equalTo: 'The two inputs do not match',
  ltTo: 'The minimum value of {0} should be less than {1}',
  ltDateTo: '{0} should be earlier than {1}',
  gtDateTo: '{0} should be later than {1}',
  unequalTo: '{0} must be different from {1}',
  intervalTo: 'Please enter a valid interval value',
  notUnique: '{0} already exists',
  incorrect: 'Please enter correct {0}',
};

export interface NcValidationTransformer {
  transform(errors?: ValidationErrors, label?: string): string | null;
}

@Injectable()
export class NcFormValidationTransformer implements NcValidationTransformer {
  transform(errors?: ValidationErrors, label?: string, messages?: { [key: string]: string }) {
    if (!errors) {
      return '';
    }

    const templates = { ...DEFAULT_TEMPLATES, ...messages };

    /** Validators.required */
    if (errors.hasOwnProperty('required')) {
      /** 自定义 requiredSelection */
      if (errors.hasOwnProperty('selection')) {
        return this._format(templates['selection'], label);

        /** 自定义 requiredSelection */
      } else if (errors.hasOwnProperty('upload')) {
        return this._format(templates['upload'], label);
      }

      /** 默认必输入验证 */
      return this._format(templates['required'], label);

      /** 自定义 equalTo */
    } else if (errors.hasOwnProperty('email')) {
      return this._format(templates['email'], label);
    } else if (errors.hasOwnProperty('min')) {
      return this._format(templates['min'], label, errors['min'].min);
    } else if (errors.hasOwnProperty('max')) {
      return this._format(templates['max'], label, errors['max'].max);
    } else if (errors.hasOwnProperty('minlength')) {
      return this._format(templates['minlength'], label, errors['minlength'].requiredLength);
    } else if (errors.hasOwnProperty('maxlength')) {
      return this._format(templates['maxlength'], label, errors['maxlength'].requiredLength);
    } else if (errors.hasOwnProperty('pattern')) {
      return this._format(templates['pattern'], label);
    } else if (errors.hasOwnProperty('equalTo')) {
      return this._format(templates['equalTo'], label, errors['equalLabel']);

      /** 自定义 ltTo */
    } else if (errors.hasOwnProperty('ltTo')) {
      return this._format(templates['ltTo'], label, errors['ltLabel']);

      /** 自定义 ltDateTo */
    } else if (errors.hasOwnProperty('ltDateTo')) {
      return this._format(templates['ltDateTo'], label, errors['ltLabel']);

      /** 自定义 gtDateTo */
    } else if (errors.hasOwnProperty('gtDateTo')) {
      return this._format(templates['gtDateTo'], label, errors['gtLabel']);

      /** 自定义 unequalTo */
    } else if (errors.hasOwnProperty('unequalTo')) {
      return this._format(templates['unequalTo'], label, errors['unequalLabel']);

      /** 自定义 intervalTo */
    } else if (errors.hasOwnProperty('intervalTo')) {
      return this._format(templates['intervalTo']);

      /** 自定义 notUnique */
    } else if (errors.hasOwnProperty('notUnique')) {
      return this._format(templates['notUnique'], label);

      /** 自定义 incorrect */
    } else if (errors.hasOwnProperty('incorrect')) {
      return this._format(templates['incorrect'], label);
    } else {
      return '';
    }
  }

  protected _format(template: string, ...args: any[]) {
    return template.replace(/\{(\d+)\}/g, function (match: any, number: number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }
}

export const NC_VALIDATION_TRANSFOMER = new InjectionToken<NcValidationTransformer>('nc-validation-transformer');
