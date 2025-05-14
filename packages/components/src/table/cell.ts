import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';

/**
 * table 列单元格定义指令
 */
@Directive({
  selector: '[ncCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: NcCellDef }],
})
export class NcCellDef extends CdkCellDef {}

/**
 * table 头部单元格定义指令
 */
@Directive({
  selector: '[ncHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: NcHeaderCellDef }],
})
export class NcHeaderCellDef extends CdkHeaderCellDef {}

/**
 * table 底部单元格定义指令
 */
@Directive({
  selector: '[ncFooterCellDef]',
  providers: [{ provide: CdkFooterCellDef, useExisting: NcFooterCellDef }],
})
export class NcFooterCellDef extends CdkFooterCellDef {}

/**
 * table 列定义指令
 */
@Directive({
  selector: '[ncColumnDef]',
  providers: [{ provide: CdkColumnDef, useExisting: NcColumnDef }],
})
export class NcColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('ncColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(name: string) {
    this._setNameInput(name);
  }

  /**
   * Add "mat-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "mat-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`nc-column-${this.cssClassFriendlyName}`);
  }
}

/**
 * table 头部单元格结构指令
 * */
@Directive({
  selector: 'nc-header-cell, th[nc-header-cell]',
  host: {
    class: 'nc-header-cell',
    role: 'columnheader',
  },
})
export class NcHeaderCell extends CdkHeaderCell {}

/**
 * table 底部单元格结构指令
 * */
@Directive({
  selector: 'nc-footer-cell, td[nc-footer-cell]',
  host: {
    class: 'nc-footer-cell',
    role: 'gridcell',
  },
})
export class NcFooterCell extends CdkFooterCell {}

/**
 * table 单元格结构指令
 */
@Directive({
  selector: 'nc-cell, td[nc-cell]',
  host: {
    class: 'nc-cell',
    role: 'gridcell',
  },
})
export class NcCell extends CdkCell {}
