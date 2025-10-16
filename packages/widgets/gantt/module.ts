import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';

import {
  NcGanttCell,
  NcGanttCellDef,
  NcGanttColumnDef,
  NcGanttHeaderCell,
  NcGanttHeaderCellDef
} from './cell';
import { NcGantt } from './gantt';
import {
  NcGanttTableHeaderRow,
  NcGanttTableHeaderRowDef,
  NcGanttTableRow,
  NcGanttTableRowDef,
  NcGanttTimelineRow,
  NcGanttTimelineRowDef
} from './row';

const EXPORTS_DECLARATIONS = [
  NcGantt,

  // row
  NcGanttTableRow,
  NcGanttTableRowDef,
  NcGanttTableHeaderRow,
  NcGanttTableHeaderRowDef,
  NcGanttTimelineRow,
  NcGanttTimelineRowDef,

  // column
  NcGanttColumnDef,

  // cell
  NcGanttCellDef,
  NcGanttCell,
  NcGanttHeaderCellDef,
  NcGanttHeaderCell,
];

@NgModule({
  imports: [CdkTableModule, ...EXPORTS_DECLARATIONS],
  exports: EXPORTS_DECLARATIONS,
})
export class NcGanttModule {}
