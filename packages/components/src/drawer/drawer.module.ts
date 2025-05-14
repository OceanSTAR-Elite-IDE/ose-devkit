import { NgModule } from '@angular/core';

import { NcDrawerContainer } from './drawer-container';
import { NcDrawerComponent } from './drawer';

@NgModule({
  imports: [NcDrawerComponent, NcDrawerContainer],
  exports: [NcDrawerComponent, NcDrawerContainer],
})
export class NcDrawerModule {}
