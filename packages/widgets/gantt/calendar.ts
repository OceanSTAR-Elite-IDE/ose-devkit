import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewEncapsulation } from '@angular/core';

import { NcGanttCalendarAdapter } from './calendar-adapter';
import { NC_GANTT_CONTAINER, NcGanttContainer } from './container';

/**
 * 甘特图时间轴日历组件
 */
@Component({
  imports: [CommonModule],
  selector: 'nc-gantt-calendar',
  template: `
    <div *ngFor="let calendar of _currentCalendar | async" class="nc-gantt-calendar-part">
      <div class="nc-gantt-calendar-group nc-gantt-calendar-group-title nc-gantt-cell-outlet">
        {{ calendar.groupName }}
      </div>
      <div class="nc-gantt-calendar-group nc-gantt-cell-outlet">
        <div
          *ngFor="let child of calendar.children"
          class="nc-gantt-calendar-cell"
          [class.nc-gantt-calendar-cell-holiday]="child.holiday">
          {{ child.label }}
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-gantt-calendar',
  },
})
export class NcGanttCalendar<D> {
  private _ganttContainer = inject<NcGanttContainer<D>>(NC_GANTT_CONTAINER);
  private _elementRef = inject(ElementRef);

  // 注入日历适配器服务
  private _calendarAdapter = inject(NcGanttCalendarAdapter<D>);

  _currentCalendar = this._calendarAdapter.changed.pipe(
    map(() => this._calendarAdapter.getCalendarOfType(this._ganttContainer.calendarType)),
  );

  getHeight(): any {
    return getComputedStyle(this._elementRef.nativeElement).getPropertyValue('height');
  }

  /**
   * 获取当前视图类型的日历单元格宽度
   */
  getCalendarCellWidth(): number {
    const width = getComputedStyle(this._ganttContainer.elementRef.nativeElement).getPropertyValue(
      '--nc-gantt-calendar-cell-width',
    );
    return parseInt(width, 10); // 默认宽度
  }
}
