import { NgModule } from '@angular/core';

import { NcButtonGroup } from './button-group';
import { NcButton } from './button';

@NgModule({
  imports: [NcButton, NcButtonGroup],
  exports: [NcButton, NcButtonGroup],
})
export class NcButtonModule {}
