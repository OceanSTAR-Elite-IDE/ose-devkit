import { NgModule } from '@angular/core';

import { NcDropdownPane } from './dropdown-pane';
import { NcDropdown } from './dropdown';

@NgModule({
  imports: [NcDropdown, NcDropdownPane],
  exports: [NcDropdown, NcDropdownPane],
})
export class NcDropdownModule {}
