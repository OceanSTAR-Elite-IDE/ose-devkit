import { CdkCell, CdkCellDef, CdkColumnDef, CdkHeaderCell, CdkHeaderCellDef } from '@angular/cdk/table';
import { Directive, inject, Input } from '@angular/core';

/**
 * table 列单元格定义指令
 */
@Directive({
  selector: '[ncGanttCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: NcGanttCellDef }],
})
export class NcGanttCellDef extends CdkCellDef {}

/**
 * table 头部单元格定义指令
 */
@Directive({
  selector: '[ncGanttHeaderCellDef]',
  providers: [{ provide: CdkHeaderCellDef, useExisting: NcGanttHeaderCellDef }],
})
export class NcGanttHeaderCellDef extends CdkHeaderCellDef {}

/**
 * table 列定义指令
 */
@Directive({
  selector: '[ncGanttColumnDef]',
  providers: [{ provide: CdkColumnDef, useExisting: NcGanttColumnDef }],
  inputs: ['width', 'minWidth', 'maxWidth'],
})
export class NcGanttColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('ncGanttColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(name: string) {
    this._setNameInput(name);
  }

  width: number | null = null;

  minWidth: number | null = null;

  maxWidth: number | null = null;

  /**
   * Add "mat-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "mat-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`nc-gantt-column-${this.cssClassFriendlyName}`);
  }
}

/**
 * table 头部单元格结构指令
 * */
@Directive({
  selector: 'nc-gantt-header-cell',
  host: {
    class: 'nc-gantt-cell nc-gantt-header-cell',
    '[style.width]': `_columnDef.width ? _columnDef.width + 'px' : 'inherit'`,
    '[style.minWidth]': `_columnDef.minWidth ? _columnDef.minWidth + 'px' : 'inherit'`,
    '[style.maxWidth]': `_columnDef.maxWidth ? _columnDef.maxWidth + 'px' : 'inherit'`,
    '[class.nc-gantt-fixed-width]': `_columnDef.width !== null`,
    role: 'columnheader',
  },
})
export class NcGanttHeaderCell extends CdkHeaderCell {
  _columnDef = inject(NcGanttColumnDef);
}

/**
 * table 单元格结构指令
 */
@Directive({
  selector: 'nc-gantt-cell',
  host: {
    class: 'nc-gantt-cell',
    '[style.width]': `_columnDef.width ? _columnDef.width + 'px' : 'inherit'`,
    '[style.minWidth]': `_columnDef.minWidth ? _columnDef.minWidth + 'px' : 'inherit'`,
    '[style.maxWidth]': `_columnDef.maxWidth ? _columnDef.maxWidth + 'px' : 'inherit'`,
    '[class.nc-gantt-fixed-width]': `_columnDef.width !== null`,
    role: 'gridcell',
  },
})
export class NcGanttCell extends CdkCell {
  _columnDef = inject(NcGanttColumnDef);
}
