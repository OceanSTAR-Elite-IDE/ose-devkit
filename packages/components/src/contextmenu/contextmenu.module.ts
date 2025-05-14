import { NgModule } from '@angular/core';

import { NcContextMenuPane } from './contextmenu-pane';
import { NcContextMenu } from './contextmenu';

@NgModule({
  imports: [NcContextMenuPane, NcContextMenu, NcContextMenu],
  exports: [NcContextMenuPane, NcContextMenu, NcContextMenu],
})
export class NcContextMenuModule {}
