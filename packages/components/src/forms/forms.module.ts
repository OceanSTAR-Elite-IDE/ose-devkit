import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { NcFormAutofocus } from './form-autofocus';
import { NcFormErrorPipe } from './form-error.pipe';
import { NcFormField } from './form-field';
import { NcFormLabelWidth } from './form-label-width';
import { NcFormOrientation } from './form-orientation';
import { NC_VALIDATION_TRANSFOMER, NcFormValidationTransformer, NcValidationTransformer } from './form-validation';

@NgModule({
  imports: [NcFormField, NcFormAutofocus, NcFormLabelWidth, NcFormOrientation, NcFormErrorPipe],
  exports: [NcFormField, NcFormAutofocus, NcFormLabelWidth, NcFormOrientation, NcFormErrorPipe],
})
export class NcFormsModule {
  public static forRoot(transformer?: Type<NcValidationTransformer>): ModuleWithProviders<NcFormsModule> {
    return {
      ngModule: NcFormsModule,
      providers: [{ provide: NC_VALIDATION_TRANSFOMER, useClass: transformer || NcFormValidationTransformer }],
    };
  }
}
