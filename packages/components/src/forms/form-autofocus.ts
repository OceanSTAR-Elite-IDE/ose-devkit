import { AfterContentInit, ContentChildren, DestroyRef, Directive, inject, Optional, QueryList } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective, NgForm } from '@angular/forms';

import { NcFormField } from './form-field';

@Directive({
  selector: 'form[ncFormAutofocus]',
})
export class NcFormAutofocus implements AfterContentInit {
  private _destroyRef = inject(DestroyRef);

  formContainer: NgForm | FormGroupDirective;

  @ContentChildren(NcFormField, { descendants: true }) fields!: QueryList<NcFormField>;

  constructor(@Optional() form: NgForm, @Optional() formGroup: FormGroupDirective) {
    this.formContainer = form || formGroup;
  }

  ngAfterContentInit() {
    if (this.formContainer) {
      this.formContainer.ngSubmit.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
        const field = this.fields.find(field => !!field.ngControl && !!field.ngControl.invalid);
        if (typeof field?.control?.focus === 'function') {
          field.control.focus();
        }
      });
    }
  }
}
