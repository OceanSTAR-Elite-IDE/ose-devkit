import { BooleanInput } from '@angular/cdk/coercion';
import { Directive } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';

@Directive()
export abstract class NcFormFieldControl<T> {
  value?: T | null;

  readonly placeholder?: string;

  readonly ngControl?: NgControl | null;

  readonly focused?: BooleanInput;

  readonly empty?: BooleanInput;

  readonly required?: BooleanInput;

  readonly disabled?: BooleanInput;

  getErrors?(): ValidationErrors | null;

  focus?(): void;
}
