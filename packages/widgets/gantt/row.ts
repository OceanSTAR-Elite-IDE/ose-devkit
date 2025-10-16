import { Subscription } from 'rxjs';

import { CDK_ROW_TEMPLATE, CdkCellOutlet, CdkHeaderRow, CdkHeaderRowDef, CdkNoDataRow, CdkRow, CdkRowDef } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DateAdapter, NC_DATE_FORMATS } from '@oceanstar/components/core';
import { NcTooltipModule } from '@oceanstar/components/tooltip';

import { NcGanttCalendarAdapter } from './calendar-adapter';

@Directive({
  selector: '[ncGanttTableHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: NcGanttTableHeaderRowDef }],
  inputs: [{ name: 'columns', alias: 'ncGanttTableHeaderRowDef' }],
})
export class NcGanttTableHeaderRowDef extends CdkHeaderRowDef {}

@Directive({
  selector: '[ncGanttTableRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: NcGanttTableRowDef }],
  inputs: [
    { name: 'columns', alias: 'ncGanttTableRowDefColumns' },
    { name: 'when', alias: 'ncGanttTableRowDefWhen' },
  ],
})
export class NcGanttTableRowDef<T> extends CdkRowDef<T> {}

@Directive({
  selector: '[ncGanttTimelineRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: NcGanttTimelineRowDef }],
  inputs: [{ name: 'when', alias: 'ncGanttTimelineRowDefWhen' }],
})
export class NcGanttTimelineRowDef<T> extends CdkRowDef<T> {}

@Component({
  selector: 'nc-gantt-table-header-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'nc-gantt-cell-outlet nc-gantt-table-row nc-gantt-table-header-row',
    role: 'ganttTableRow',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncGanttTableHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: NcGanttTableHeaderRow }],
  imports: [CdkCellOutlet],
})
export class NcGanttTableHeaderRow extends CdkHeaderRow {}

@Component({
  selector: 'nc-gantt-table-row',
  template: CDK_ROW_TEMPLATE,
  host: {
    class: 'nc-gantt-cell-outlet nc-gantt-row nc-gantt-table-row',
    role: 'ganttTableRow',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncGanttTableRow',
  providers: [{ provide: CdkRow, useExisting: NcGanttTableRow }],
  imports: [CdkCellOutlet],
})
export class NcGanttTableRow extends CdkRow {}

@Component({
  imports: [CommonModule, NcTooltipModule],
  selector: 'nc-gantt-timeline-row',
  template: `
    <div *ngIf="hasDates" class="nc-gantt-timeline-bar">
      <div class="nc-gantt-timeline-progress" [nc-tooltip]="tooltip">
        <div class="nc-gantt-timeline-progress-meter" [style.width.%]="progress"></div>
      </div>
      <div class="nc-gantt-timeline-content">
        <ng-content />
      </div>
    </div>
    <ng-template #tooltip>
      <p>Start: {{ start ? _formatDate(start) : '-' }}</p>
      <p>End: {{ end ? _formatDate(end) : '-' }}</p>
      <p>Progress: {{ progress }}%</p>
    </ng-template>
  `,
  host: {
    class: 'nc-gantt-row nc-gantt-timeline-row',
    role: 'ganttTimelineRow',
    '[style.--width-value-daily]': '_calculatedValues.daily.width',
    '[style.--width-value-weekly]': '_calculatedValues.weekly.width',
    '[style.--width-value-monthly]': '_calculatedValues.monthly.width',
    '[style.--offset-value-daily]': '_calculatedValues.daily.offset',
    '[style.--offset-value-weekly]': '_calculatedValues.weekly.offset',
    '[style.--offset-value-monthly]': '_calculatedValues.monthly.offset',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ncGanttTimelineRow',
  providers: [{ provide: CdkRow, useExisting: NcGanttTimelineRow }],
})
export class NcGanttTimelineRow<D> extends CdkRow implements OnChanges, OnInit, OnDestroy {
  private _dateAdapter = inject(DateAdapter);
  private _dateFormats = inject(NC_DATE_FORMATS);
  // 不再需要_ganttContainer
  // private _ganttContainer = inject<NcGanttContainer<D>>(NC_GANTT_CONTAINER);

  private _calendarAdapter: NcGanttCalendarAdapter<D> = inject(NcGanttCalendarAdapter);

  // 添加订阅变量
  private _dateRangeSubscription: Subscription | null = null;

  @Input() progress = 0;

  private _start!: D;
  @Input()
  get start(): D {
    return this._start;
  }
  set start(value: D) {
    this._start = this._dateAdapter.deserialize(value);
  }

  private _end!: D;
  @Input()
  get end(): D {
    return this._end;
  }
  set end(value: D) {
    this._end = this._dateAdapter.deserialize(value);
  }

  // 用于判断是否显示时间轴条
  get hasDates(): boolean {
    return !!(this._start || this._end);
  }

  // 存储所有视图类型的计算结果
  _calculatedValues = {
    daily: { width: 0, offset: 0 },
    weekly: { width: 0, offset: 0 },
    monthly: { width: 0, offset: 0 },
  };

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['start'] || changes['end'];
    if (change) {
      this._calculatePositionAndWidth();
    }
  }

  ngOnInit(): void {
    // 订阅日历数据变化事件
    this._dateRangeSubscription = this._calendarAdapter.changed.subscribe(calendarMaps => {
      if (calendarMaps !== null) {
        // 当日历数据变化时重新计算位置和宽度
        this._calculatePositionAndWidth();
      }
    });
  }

  ngOnDestroy(): void {
    // 取消订阅，防止内存泄漏
    if (this._dateRangeSubscription) {
      this._dateRangeSubscription.unsubscribe();
      this._dateRangeSubscription = null;
    }
  }

  _formatDate(date: D) {
    return this._dateAdapter.format(date, this._dateFormats.display.dateInput);
  }

  private _calculatePositionAndWidth() {
    // 如果两个日期都为空，不做任何计算
    if (!this._start && !this._end) {
      // 重置计算结果
      this._calculatedValues = {
        daily: { width: 0, offset: 0 },
        weekly: { width: 0, offset: 0 },
        monthly: { width: 0, offset: 0 },
      };
      return;
    }

    try {
      // 同时计算所有视图类型的值
      this._calculateDailyValues();
      this._calculateWeeklyValues();
      this._calculateMonthlyValues();
    } catch (error) {
      console.error('Error calculating timeline position and width:', error);
      // 设置默认值，避免界面错误
    }
  }

  private _calculateDailyValues() {
    // 从适配器获取日历数据
    const dailyCalendar = this._calendarAdapter.getCalendarOfType('daily');
    if (!dailyCalendar || dailyCalendar.length === 0) {
      return;
    }

    // 获取日历的第一个和最后一个日期
    const calendarStartDate = dailyCalendar[0].children[0].value;

    // 计算日历中最后一个日期
    const lastGroup = dailyCalendar[dailyCalendar.length - 1];
    const lastChildren = lastGroup.children;
    const calendarEndDate = lastChildren[lastChildren.length - 1].value;

    // 处理日期为空的情况
    let effectiveStartDate: D;
    let effectiveEndDate: D;
    let fixedWidth = false;

    // 处理3种情况
    if (this._start && this._end) {
      // 情况1：两个日期都有值
      effectiveStartDate = this._start;
      effectiveEndDate = this._end;

      // 确保开始日期不晚于结束日期
      if (this._dateAdapter.compareDate(effectiveStartDate, effectiveEndDate) > 0) {
        effectiveEndDate = effectiveStartDate;
      }
    } else if (this._start && !this._end) {
      // 情况2：只有开始日期
      effectiveStartDate = this._start;
      effectiveEndDate = this._start;
      fixedWidth = true;
    } else {
      // 情况3：只有结束日期
      effectiveStartDate = this._end!;
      effectiveEndDate = this._end!;
      fixedWidth = true;
    }

    // 确保任务开始日期不早于日历开始日期
    if (this._dateAdapter.compareDate(effectiveStartDate, calendarStartDate) < 0) {
      effectiveStartDate = calendarStartDate;
    }

    // 确保任务结束日期不晚于日历结束日期
    if (this._dateAdapter.compareDate(effectiveEndDate, calendarEndDate) > 0) {
      effectiveEndDate = calendarEndDate;
    }

    // 计算任务开始日期与日历开始日期的天数差（精确到秒）
    const daysDiff = this._dateAdapter.getDateDiffOfDay(calendarStartDate, effectiveStartDate) + this._getTimeOfDayFraction(effectiveStartDate);

    // 计算任务持续时间（天数）
    let durationDays;
    if (fixedWidth) {
      // 如果只有一个日期，宽度设为1天
      durationDays = 1;
    } else {
      durationDays = Math.max(
        this._dateAdapter.getDateDiffOfDay(effectiveStartDate, effectiveEndDate) +
          this._getTimeOfDayFraction(effectiveEndDate) -
          this._getTimeOfDayFraction(effectiveStartDate),
        0.001, // 至少0.001天（约1.5分钟）
      );
    }

    // 保存日视图的计算结果
    this._calculatedValues.daily.offset = Math.max(daysDiff, 0);
    this._calculatedValues.daily.width = durationDays;
  }

  private _calculateWeeklyValues() {
    // 从适配器获取周视图日历数据
    const weeklyCalendar = this._calendarAdapter.getCalendarOfType('weekly');
    if (!weeklyCalendar || weeklyCalendar.length === 0) {
      return;
    }

    // 获取日历的第一个和最后一个日期
    const calendarStartDate = weeklyCalendar[0].children[0].value;

    // 计算日历中最后一个日期
    const lastGroup = weeklyCalendar[weeklyCalendar.length - 1];
    const lastChildren = lastGroup.children;
    const calendarEndDate = this._dateAdapter.addCalendarDays(lastChildren[lastChildren.length - 1].value, 6); // 加6天得到周的最后一天

    // 处理日期为空的情况
    let effectiveStartDate: D;
    let effectiveEndDate: D;
    let fixedWidth = false;

    // 处理3种情况
    if (this._start && this._end) {
      // 情况1：两个日期都有值
      effectiveStartDate = this._start;
      effectiveEndDate = this._end;

      // 确保开始日期不晚于结束日期
      if (this._dateAdapter.compareDate(effectiveStartDate, effectiveEndDate) > 0) {
        effectiveEndDate = effectiveStartDate;
      }
    } else if (this._start && !this._end) {
      // 情况2：只有开始日期
      effectiveStartDate = this._start;
      effectiveEndDate = this._start;
      fixedWidth = true;
    } else {
      // 情况3：只有结束日期
      effectiveStartDate = this._end!;
      effectiveEndDate = this._end!;
      fixedWidth = true;
    }

    // 确保任务开始日期不早于日历开始日期
    if (this._dateAdapter.compareDate(effectiveStartDate, calendarStartDate) < 0) {
      effectiveStartDate = calendarStartDate;
    }

    // 确保任务结束日期不晚于日历结束日期
    if (this._dateAdapter.compareDate(effectiveEndDate, calendarEndDate) > 0) {
      effectiveEndDate = calendarEndDate;
    }

    // 一周的天数
    const daysInWeek = 7;

    // 计算任务开始日期与日历开始日期的天数差（精确到天的小数部分）
    const daysDiff = this._dateAdapter.getDateDiffOfDay(calendarStartDate, effectiveStartDate) + this._getTimeOfDayFraction(effectiveStartDate);

    // 将天数差转换为周数差
    const weeksDiff = daysDiff / daysInWeek;

    // 计算任务持续时间（周数）
    let durationWeeks;
    if (fixedWidth) {
      // 如果只有一个日期，宽度设为0.2周（约1天多）
      durationWeeks = 0.2;
    } else {
      const durationDays =
        this._dateAdapter.getDateDiffOfDay(effectiveStartDate, effectiveEndDate) +
        this._getTimeOfDayFraction(effectiveEndDate) -
        this._getTimeOfDayFraction(effectiveStartDate);

      durationWeeks = Math.max(durationDays / daysInWeek, 0.001); // 至少0.001周
    }

    // 保存周视图的计算结果
    this._calculatedValues.weekly.offset = Math.max(weeksDiff, 0);
    this._calculatedValues.weekly.width = durationWeeks;
  }

  private _calculateMonthlyValues() {
    // 从适配器获取月视图日历数据
    const monthlyCalendar = this._calendarAdapter.getCalendarOfType('monthly');
    if (!monthlyCalendar || monthlyCalendar.length === 0) {
      return;
    }

    // 获取日历的第一个月和最后一个月
    const calendarStartDate = monthlyCalendar[0].children[0].value;

    // 计算日历中最后一个日期
    const lastGroup = monthlyCalendar[monthlyCalendar.length - 1];
    const lastChildren = lastGroup.children;
    const calendarEndDate = lastChildren[lastChildren.length - 1].value;
    const extendedCalendarEndDate = this._dateAdapter.addCalendarMonths(calendarEndDate, 1);

    // 获取日历的起始年月
    const calendarStartYear = this._dateAdapter.getYear(calendarStartDate);
    const calendarStartMonth = this._dateAdapter.getMonth(calendarStartDate);

    // 处理日期为空的情况
    let effectiveStartDate: D;
    let effectiveEndDate: D;
    let fixedWidth = false;

    // 处理3种情况
    if (this._start && this._end) {
      // 情况1：两个日期都有值
      effectiveStartDate = this._start;
      effectiveEndDate = this._end;

      // 确保开始日期不晚于结束日期
      if (this._dateAdapter.compareDate(effectiveStartDate, effectiveEndDate) > 0) {
        effectiveEndDate = effectiveStartDate;
      }
    } else if (this._start && !this._end) {
      // 情况2：只有开始日期
      effectiveStartDate = this._start;
      effectiveEndDate = this._start;
      fixedWidth = true;
    } else {
      // 情况3：只有结束日期
      effectiveStartDate = this._end!;
      effectiveEndDate = this._end!;
      fixedWidth = true;
    }

    // 确保任务开始日期不早于日历开始日期
    if (this._dateAdapter.compareDate(effectiveStartDate, calendarStartDate) < 0) {
      effectiveStartDate = calendarStartDate;
    }

    // 确保任务结束日期不晚于日历结束日期
    if (this._dateAdapter.compareDate(effectiveEndDate, extendedCalendarEndDate) > 0) {
      effectiveEndDate = extendedCalendarEndDate;
    }

    // 获取任务日期的年月日信息
    const startYear = this._dateAdapter.getYear(effectiveStartDate);
    const startMonth = this._dateAdapter.getMonth(effectiveStartDate);
    const startDay = this._dateAdapter.getDate(effectiveStartDate);

    // 计算月份差（相对于日历起始月）
    const startMonthDiff = (startYear - calendarStartYear) * 12 + (startMonth - calendarStartMonth);

    // 计算起始月的天数
    const daysInStartMonth = this._dateAdapter.getNumDaysInMonth(effectiveStartDate);

    // 计算起始日期在月份内的偏移比例（精确到分钟）
    const startDayRatio = (startDay - 1) / daysInStartMonth;
    const startTimeRatio = this._getTimeOfDayFraction(effectiveStartDate) / daysInStartMonth;
    const startOffset = startMonthDiff + startDayRatio + startTimeRatio;

    let width = 0;

    if (fixedWidth) {
      // 如果只有一个日期，宽度设为0.1个月（约3天）
      width = 0.1;
    } else {
      const endYear = this._dateAdapter.getYear(effectiveEndDate);
      const endMonth = this._dateAdapter.getMonth(effectiveEndDate);
      const endDay = this._dateAdapter.getDate(effectiveEndDate);
      const endMonthDiff = (endYear - calendarStartYear) * 12 + (endMonth - calendarStartMonth);
      const daysInEndMonth = this._dateAdapter.getNumDaysInMonth(effectiveEndDate);

      if (startMonthDiff === endMonthDiff) {
        // 如果起始和结束在同一个月内
        const daysDiff = endDay - startDay;
        const timeDiff = this._getTimeOfDayFraction(effectiveEndDate) - this._getTimeOfDayFraction(effectiveStartDate);
        width = daysDiff / daysInStartMonth + timeDiff / daysInStartMonth;
      } else {
        // 如果跨越多个月

        // 计算起始月剩余部分比例（精确到分钟）
        const startMonthRemaining = (daysInStartMonth - startDay + 1) / daysInStartMonth;
        const startTimeAdjustment = (1 - this._getTimeOfDayFraction(effectiveStartDate)) / daysInStartMonth;

        // 计算结束月已过部分比例（精确到分钟）
        const endMonthPassed = endDay / daysInEndMonth;
        const endTimeAdjustment = this._getTimeOfDayFraction(effectiveEndDate) / daysInEndMonth;

        // 总宽度 = 起始月剩余比例 + 中间完整月份数 + 结束月已过比例
        width = startMonthRemaining - startTimeAdjustment; // 起始月剩余部分

        // 添加中间的完整月份
        if (endMonthDiff - startMonthDiff > 1) {
          width += endMonthDiff - startMonthDiff - 1;
        }

        // 添加结束月已过部分
        width += endMonthPassed + endTimeAdjustment;
      }
    }

    // 确保最小宽度
    width = Math.max(width, 0.001); // 至少0.001个月

    // 保存月视图的计算结果
    this._calculatedValues.monthly.offset = Math.max(startOffset, 0);
    this._calculatedValues.monthly.width = width;
  }

  /**
   * 获取日期的时间部分（小时:分钟:秒）所占一天的比例
   * @param date 日期对象
   * @returns 返回0-1之间的小数，表示一天内的时间比例
   */
  private _getTimeOfDayFraction(date: D): number {
    // 从DateAdapter格式化字符串，提取时间信息
    const timeStr = this._dateAdapter.format(date, 'HH:mm:ss');
    const timeParts = timeStr.split(':');

    if (timeParts.length >= 3) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      // 一天的总秒数
      const totalSecondsInDay = 24 * 60 * 60;

      // 计算当前时间的总秒数
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      // 返回时间比例
      return totalSeconds / totalSecondsInDay;
    }

    return 0; // 如果无法解析时间，返回0
  }
}

@Directive({
  selector: 'ng-template[ncGanttNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: NcGanttNoDataRow }],
})
export class NcGanttNoDataRow extends CdkNoDataRow {}
