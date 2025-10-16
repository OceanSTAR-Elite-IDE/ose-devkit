import { BehaviorSubject, Subscription } from 'rxjs';

import { DestroyRef, inject, Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateAdapter, NC_DATE_FORMATS } from '@oceanstar/components/core';

import { NC_GANTT_CONTAINER, NcGanttCalendarType, NcGanttContainer } from './container';

export interface NcGanttCalendarChild<D> {
  value: D;
  label: string;
  holiday?: boolean;
}

export interface NcGanttCalendarGroup<D> {
  groupName: string;
  children: NcGanttCalendarChild<D>[];
}

@Injectable()
export class NcGanttCalendarAdapter<D> implements OnDestroy {
  private _dateAdapter: DateAdapter<D> = inject(DateAdapter);
  private _dateFormats = inject(NC_DATE_FORMATS);
  private _destroyRef = inject(DestroyRef);
  private _ganttContainer = inject<NcGanttContainer<D>>(NC_GANTT_CONTAINER);

  // 日历缓存
  private _calendarCaches = new Map<NcGanttCalendarType, NcGanttCalendarGroup<D>[]>();

  private _dataChangeSubscription!: Subscription;

  // 当前日期范围
  private _currentMinDate!: D;
  private _currentMaxDate!: D;

  private _changed = new BehaviorSubject<any>(null);

  get changed() {
    return this._changed.asObservable();
  }

  constructor() {
    // 订阅日期范围变化
    this._dataChangeSubscription = this._ganttContainer.dataChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(({ minDate, maxDate }) => {
      // 预先构建所有类型的日历
      this._updateAllCalendars(minDate, maxDate);
    });
  }

  ngOnDestroy(): void {
    // 清理资源
    this._calendarCaches.clear();
    this._dataChangeSubscription.unsubscribe();
  }

  /**
   * 获取指定类型的当前日历数据
   */
  getCalendarOfType(type: NcGanttCalendarType): NcGanttCalendarGroup<D>[] {
    return this._calendarCaches.get(type) || [];
  }

  /**
   * 格式化日期显示
   */
  formatDate(date: D, calendarType: NcGanttCalendarType): string {
    if (calendarType === 'daily') {
      return this._dateAdapter.getDate(date) + '';
    } else if (calendarType === 'monthly') {
      return this._dateAdapter.format(date, this._dateFormats.display.monthLabel);
    } else if (calendarType === 'weekly') {
      const dayFormat = this._dateFormats.display.day;
      const weekStartString = this._dateAdapter.format(date, dayFormat);
      const weekEndString = this._dateAdapter.format(this._dateAdapter.addCalendarDays(date, 6), dayFormat);
      return `${weekStartString}~${weekEndString}`;
    }
    return this._dateAdapter.format(date, this._dateFormats.display.dateInput);
  }

  /**
   * 更新所有类型的日历数据
   */
  private _updateAllCalendars(minDate: D, maxDate: D): void {
    if (!!minDate && !!maxDate && minDate !== this._currentMinDate && maxDate !== this._currentMaxDate) {
      this._currentMinDate = minDate;
      this._currentMaxDate = maxDate;
      // 预构建所有视图类型的日历
      this._buildDailyCalendar(this._currentMinDate, this._currentMaxDate);
      this._buildWeeklyCalendar(this._currentMinDate, this._currentMaxDate);
      this._buildMonthlyCalendar(this._currentMinDate, this._currentMaxDate);
    }
    this._changed.next(this._calendarCaches);
  }

  private _isHoliday(date: D) {
    return this._dateAdapter.getDayOfWeek(date) === 0 || this._dateAdapter.getDayOfWeek(date) === 6;
  }

  /**
   * 根据日期范围构建日视图表
   * @param minDate 最小日期
   * @param maxDate 最大日期
   */
  private _buildDailyCalendar(minDate: D, maxDate: D): NcGanttCalendarGroup<D>[] {
    // 最小日期从当月第一天开始
    const startDate = this._createMonthStart(minDate);

    // 最大日期到当月第一天
    const endDate = this._createMonthStart(maxDate);

    const calendars = new Array<NcGanttCalendarGroup<D>>();

    // 生成日历数据
    let clampDate = this._dateAdapter.clone(startDate);
    calendars.push(this._buildDailyGroup(clampDate));

    while (this._dateAdapter.compareDate(clampDate, endDate) < 0) {
      clampDate = this._dateAdapter.clampDate(this._dateAdapter.addCalendarMonths(clampDate, 1), startDate, endDate);
      calendars.push(this._buildDailyGroup(clampDate));
    }

    this._calendarCaches.set('daily', calendars);
    return calendars;
  }

  /**
   * 根据日期范围构建周视图表
   * @param minDate 最小日期
   * @param maxDate 最大日期
   */
  private _buildWeeklyCalendar(minDate: D, maxDate: D): NcGanttCalendarGroup<D>[] {
    // 计算起始日期所在周的第一天（根据firstDayOfWeek设置）
    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
    const minDayOfWeek = this._dateAdapter.getDayOfWeek(minDate);

    // 计算需要回溯的天数，确保从周的第一天开始
    const daysToSubtract = (minDayOfWeek - firstDayOfWeek + 7) % 7;
    const startDate = this._dateAdapter.addCalendarDays(minDate, -daysToSubtract);

    // 计算结束日期所在周的最后一天
    const maxDayOfWeek = this._dateAdapter.getDayOfWeek(maxDate);
    const daysToAdd = (7 - maxDayOfWeek + firstDayOfWeek - 1) % 7;
    const endDate = this._dateAdapter.addCalendarDays(maxDate, daysToAdd);

    const calendars: NcGanttCalendarGroup<D>[] = [];
    const monthGroups = new Map<string, NcGanttCalendarGroup<D>>();

    // 创建每周的起始日期，并按月份分组
    let currentDate = this._dateAdapter.clone(startDate);

    // 遍历日期范围，每次增加一周
    while (this._dateAdapter.compareDate(currentDate, endDate) <= 0) {
      // 获取当前日期的年月
      const year = this._dateAdapter.getYear(currentDate);
      const month = this._dateAdapter.getMonth(currentDate);

      // 创建唯一键，用于区分不同年月的分组
      const groupKey = `${year}-${month}`;

      // 获取或创建月份分组
      if (!monthGroups.has(groupKey)) {
        monthGroups.set(groupKey, {
          groupName: this._dateAdapter.format(currentDate, this._dateFormats.display.monthYearLabel),
          children: [],
        });
      }

      // 将当前周起始日期添加到对应月份分组
      const group = monthGroups.get(groupKey)!;
      group.children.push({
        value: currentDate,
        label: this.formatDate(currentDate, 'weekly'),
      });
      // 增加一周
      currentDate = this._dateAdapter.addCalendarDays(currentDate, 7);
    }

    // 将月份分组转换为数组并排序
    Array.from(monthGroups.values())
      .sort((a, b) => {
        const dateA = a.children[0].value;
        const dateB = b.children[0].value;
        return this._dateAdapter.compareDate(dateA, dateB);
      })
      .forEach(group => calendars.push(group));

    this._calendarCaches.set('weekly', calendars);
    return calendars;
  }

  /**
   * 根据日期范围构建月视图表
   * @param minDate 最小日期
   * @param maxDate 最大日期
   */
  private _buildMonthlyCalendar(minDate: D, maxDate: D): NcGanttCalendarGroup<D>[] {
    // 从当前得到的最小日的第一天开始
    const startDate = this._createMonthStart(minDate);

    // 在当前得到的最大日期的下一个月第一天结束，避免在表格上显的太紧凑
    const endDate = this._dateAdapter.addCalendarMonths(this._createMonthStart(maxDate), 2);

    const calendars = new Array<NcGanttCalendarGroup<D>>();

    let clampDate = this._dateAdapter.clone(startDate);
    calendars.push(this._buildMonthlyGroup(clampDate, endDate));

    while (this._dateAdapter.getYear(endDate) - this._dateAdapter.getYear(clampDate) > 0) {
      clampDate = this._dateAdapter.createDate(1 + this._dateAdapter.getYear(clampDate), 0, 1);
      calendars.push(this._buildMonthlyGroup(clampDate, endDate));
    }

    this._calendarCaches.set('monthly', calendars);
    return calendars;
  }

  /**
   * 创建月份首日
   */
  private _createMonthStart(date: D): D {
    return this._dateAdapter.createDate(this._dateAdapter.getYear(date), this._dateAdapter.getMonth(date), 1);
  }

  /**
   * 构建日视图分组
   */
  private _buildDailyGroup(date: D): NcGanttCalendarGroup<D> {
    const dayCount = this._dateAdapter.getNumDaysInMonth(date);
    const currentYear = this._dateAdapter.getYear(date);
    const currentMonth = this._dateAdapter.getMonth(date);

    const children = new Array<NcGanttCalendarChild<D>>();

    for (let i = 0; i < dayCount; i++) {
      const child = this._dateAdapter.createDate(currentYear, currentMonth, 1 + i);
      children.push({
        value: child,
        label: this.formatDate(child, 'daily'),
        holiday: this._isHoliday(child),
      });
    }

    return {
      groupName: this._dateAdapter.format(date, this._dateFormats.display.monthYearLabel),
      children,
    };
  }

  /**
   * 构建月视图分组
   */
  private _buildMonthlyGroup(startDay: D, endDay: D): NcGanttCalendarGroup<D> {
    const monthNames = this._dateAdapter.getMonthNames('short');
    const currentMonth = this._dateAdapter.getMonth(startDay);

    const monthRange =
      this._dateAdapter.getYear(startDay) === this._dateAdapter.getYear(endDay)
        ? monthNames.slice(currentMonth, this._dateAdapter.getMonth(endDay) + 1)
        : monthNames.slice(currentMonth);

    const children = new Array<NcGanttCalendarChild<D>>();

    for (let i = 0; i < monthRange.length; i++) {
      const child = this._dateAdapter.createDate(this._dateAdapter.getYear(startDay), currentMonth + i, 1);
      children.push({
        value: child,
        label: this.formatDate(child, 'monthly'),
      });
    }
    return {
      groupName: this._dateAdapter.getYearName(startDay),
      children,
    };
  }
}
