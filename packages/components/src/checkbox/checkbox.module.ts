import { NgModule } from '@angular/core';

import { NcCheckboxGroup } from './checkbox-group';
import { NcCheckbox } from './checkbox';

@NgModule({
  imports: [NcCheckbox, NcCheckboxGroup],
  exports: [NcCheckbox, NcCheckboxGroup],
})
export class NcCheckboxModule {}
