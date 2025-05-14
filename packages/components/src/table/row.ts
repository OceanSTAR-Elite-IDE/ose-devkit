import {
  CDK_ROW_TEMPLATE,
  CdkCellOutlet,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: '[ncHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: NcHeaderRowDef }],
  inputs: ['columns: ncHeaderRowDef', 'sticky: ncHeaderRowDefSticky'],
})
export class NcHeaderRowDef extends CdkHeaderRowDef {}

@Directive({
  selector: '[ncFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: NcFooterRowDef }],
  inputs: ['columns: ncFooterRowDef', 'sticky: ncFooterRowDefSticky'],
})
export class NcFooterRowDef extends CdkFooterRowDef {}

@Directive({
  selector: '[ncRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: NcRowDef }],
  inputs: ['columns: ncRowDefColumns', 'when: ncRowDefWhen'],
})
export class NcRowDef<T> extends CdkRowDef<T> {}

@Component({
  selector: 'nc-header-row, tr[nc-header-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'nc-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: NcHeaderRow }],
  imports: [CdkCellOutlet],
})
export class NcHeaderRow extends CdkHeaderRow {}

@Component({
  selector: 'nc-footer-row, tr[nc-footer-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'nc-footer-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: NcFooterRow }],
  imports: [CdkCellOutlet],
})
export class NcFooterRow extends CdkFooterRow {}

@Component({
  selector: 'nc-row, tr[nc-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'nc-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncRow',
  providers: [{ provide: CdkRow, useExisting: NcRow }],
  imports: [CdkCellOutlet],
})
export class NcRow extends CdkRow {}

@Directive({
  selector: 'ng-template[ncNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: NcNoDataRow }],
})
export class NcNoDataRow extends CdkNoDataRow {}
