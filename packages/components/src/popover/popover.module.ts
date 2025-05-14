import { NgModule } from '@angular/core';

import { NcPopover } from './popover';
import { NcPopoverPane } from './popover-pane';

@NgModule({
  imports: [NcPopover, NcPopoverPane],
  exports: [NcPopover, NcPopoverPane],
})
export class NcPopoverModule {}
