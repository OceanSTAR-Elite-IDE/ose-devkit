import { NgModule } from '@angular/core';
import { NcOption } from '@oceanstar/components/core';

import { NcSelect } from './select';

@NgModule({
  imports: [NcOption, NcSelect],
  exports: [NcSelect, NcOption],
})
export class NcSelectModule {}
