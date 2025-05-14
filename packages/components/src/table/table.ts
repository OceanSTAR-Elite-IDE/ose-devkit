import { _DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import {
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  CDK_TABLE,
  CDK_TABLE_TEMPLATE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, Input, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: 'nc-table[recycleRows], table[nc-table][recycleRows]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
})
export class NcRecycleRows {}

@Component({
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
  selector: 'nc-table, table[nc-table]',
  exportAs: 'ncTable',
  template: CDK_TABLE_TEMPLATE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    { provide: CdkTable, useExisting: NcTable },
    { provide: CDK_TABLE, useExisting: NcTable },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  host: {
    class: 'nc-table',
    '[class.no-border]': 'noBorder',
  },
})
export class NcTable<T> extends CdkTable<T> {
  @Input() noBorder = false;
}
