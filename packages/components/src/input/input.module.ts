import { Platform } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';

import { NcInputAddon } from './input-addon';
import { NcInputGroup } from './input-group';
import { NcInput } from './input';
import { NcIntegerFormat } from './integer-format';
import { NcSumPipe } from './integer-sum.pipe';

@NgModule({
  imports: [NcInput, NcInputGroup, NcInputAddon, NcIntegerFormat, NcSumPipe],
  exports: [NcInput, NcInputGroup, NcInputAddon, NcIntegerFormat, NcSumPipe],
  providers: [Platform],
})
export class NcInputModule {}
