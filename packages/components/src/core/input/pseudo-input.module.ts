import { NgModule } from '@angular/core';

import { NcPseudoCaret } from './pseudo-caret';
import { NcPseudoInput } from './pseudo-input';

@NgModule({
  imports: [NcPseudoInput, NcPseudoCaret],
  exports: [NcPseudoInput, NcPseudoCaret],
})
export class NcPseudoInputModule {}
