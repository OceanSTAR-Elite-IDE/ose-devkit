import { Platform } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';

import { NcInputAddon } from './input-addon';
import { NcInputGroup } from './input-group';
import { NcInput } from './input';
import { NcIntegerFormat } from './integer-format';
import { NcIntegerSumPipe } from './integer-sum.pipe';

@NgModule({
  imports: [NcInput, NcInputGroup, NcInputAddon, NcIntegerFormat, NcIntegerSumPipe],
  exports: [NcInput, NcInputGroup, NcInputAddon, NcIntegerFormat, NcIntegerSumPipe],
  providers: [Platform],
})
export class NcInputModule {}
