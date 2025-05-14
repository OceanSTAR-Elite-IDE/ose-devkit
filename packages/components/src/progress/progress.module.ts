import { NgModule } from '@angular/core';

import { NcProgressCircle } from './progress-circle';
import { NcProgress } from './progress';

@NgModule({
  imports: [NcProgress, NcProgressCircle],
  exports: [NcProgress, NcProgressCircle],
})
export class NcProgressModule {}
