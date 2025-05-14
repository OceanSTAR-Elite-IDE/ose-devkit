import { NgModule } from '@angular/core';

import { NcScrim } from './scrim';
import { NcScrimContainer } from './scrim-container';

@NgModule({
  imports: [NcScrim, NcScrimContainer],
  exports: [NcScrim, NcScrimContainer],
})
export class NcScrimModule {}
