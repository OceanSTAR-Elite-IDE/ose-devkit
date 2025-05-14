import { NgModule } from '@angular/core';

import { NcRadioGroup } from './radio-group';
import { NcRadio } from './radio';

@NgModule({
  imports: [NcRadio, NcRadioGroup],
  exports: [NcRadio, NcRadioGroup],
})
export class NcRadioModule {}
