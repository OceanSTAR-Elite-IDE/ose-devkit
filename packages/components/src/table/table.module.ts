import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';

import { NcCell, NcCellDef, NcColumnDef, NcFooterCell, NcFooterCellDef, NcHeaderCell, NcHeaderCellDef } from './cell';
import { NcFooterRow, NcFooterRowDef, NcHeaderRow, NcHeaderRowDef, NcNoDataRow, NcRow, NcRowDef } from './row';
import { NcRecycleRows, NcTable } from './table';

const EXPORTS_DECLARATIONS = [
  NcTable,
  NcRecycleRows,

  NcCellDef,
  NcCell,

  NcColumnDef,

  NcFooterCellDef,
  NcFooterCell,

  NcHeaderCellDef,
  NcHeaderCell,

  NcFooterRow,
  NcFooterRowDef,
  NcHeaderRow,
  NcNoDataRow,
  NcHeaderRowDef,

  NcRow,
  NcRowDef,
];

@NgModule({
  imports: [CdkTableModule, ...EXPORTS_DECLARATIONS],
  exports: EXPORTS_DECLARATIONS,
})
export class NcTableModule {}
