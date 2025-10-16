/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DateAdapter } from '../core';

import { NcCalendarUserEvent } from './calendar-body';
import { NcDatePickerCalendar } from './calendar';
import { NC_DATE_PICKER_CONTROL, NcDatePickerControl } from './datepicker-control';
import { DateRange, ExtractDateTypeFromSelection, NC_DATE_RANGE_SELECTION_STRATEGY, NcDateRangeSelectionStrategy, NcDateSelectionModel } from './selections';
import { NcTimePicker } from './time-picker';

@Component({
  imports: [CommonModule, NcDatePickerCalendar, NcTimePicker],
  selector: 'nc-datepicker-content',
  templateUrl: 'datepicker-content.html',
  host: {
    class: 'nc-datepicker-content',
  },
  exportAs: 'ncDatePickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NcDatePickerContent<S, D = ExtractDateTypeFromSelection<S>> implements AfterViewInit, OnDestroy {
  private _subscriptions = new Subscription();

  /** Reference to the internal calendar component. */
  @ViewChild(NcDatePickerCalendar) _calendar!: NcDatePickerCalendar<D>;

  /** Start of the comparison range. */
  comparisonStart!: D | null;

  /** End of the comparison range. */
  comparisonEnd!: D | null;

  constructor(
    public elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _model: NcDateSelectionModel<S, D>,
    private _dateAdapter: DateAdapter<D>,
    @Optional()
    @Inject(NC_DATE_RANGE_SELECTION_STRATEGY)
    private _rangeSelectionStrategy: NcDateRangeSelectionStrategy<D>,
    @Inject(NC_DATE_PICKER_CONTROL) public datepicker: NcDatePickerControl<D>,
  ) {}

  ngAfterViewInit() {
    this._subscriptions.add(
      this.datepicker._stateChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      }),
    );

    this._calendar.focusActiveCell();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  _handleUserSelection(event: NcCalendarUserEvent<D | null>) {
    const {selection} = this._model;
    const {value} = event;
    const isRange = selection instanceof DateRange;

    // 在月份选择模式下，直接处理选择
    if (this.datepicker.unit === 'month' && value) {
      // 设置为月份的第一天
      const jsDate = value as unknown as Date;
      const firstDayOfMonth = new Date(jsDate.getFullYear(), jsDate.getMonth(), 1);
      this._model.updateSelection(firstDayOfMonth as unknown as S, this);
      this.datepicker.overlay.close();
      return;
    }

    // If we're selecting a range and we have a selection strategy, always pass the value through
    // there. Otherwise don't assign null values to the model, unless we're selecting a range.
    // A null value when picking a range means that the user cancelled the selection (e.g. by
    // pressing escape), whereas when selecting a single value it means that the value didn't
    // change. This isn't very intuitive, but it's here for backwards-compatibility.
    if (isRange && this._rangeSelectionStrategy) {
      const newSelection = this._rangeSelectionStrategy.selectionFinished(value, selection as unknown as DateRange<D>, event.event);
      this._model.updateSelection(newSelection as unknown as S, this);
    } else if (value && (isRange || !this._dateAdapter.sameDate(value, selection as unknown as D))) {
      this._model.add(value);
    }

    // 对于 datetime 类型，选择日期后不关闭弹窗，让用户继续选择时间
    if (this.datepicker.unit === 'datetime') {
      // 不关闭弹窗，让用户继续选择时间
      return;
    }

    if (!this._model || this._model.isComplete()) {
      this.datepicker.overlay.close();
    }
  }

  _getSelected() {
    return this._model.selection as unknown as D | DateRange<D> | null;
  }

  _onTimeChange(event: { hour: number; minute: number }, type?: 'hour' | 'minute') {
    this.datepicker.onTimeChange?.('hour', event.hour);
    this.datepicker.onTimeChange?.('minute', event.minute);

    // 当 unit 为 datetime 且用户选择了分钟时，关闭弹窗
    if (this.datepicker.unit === 'datetime' && type === 'minute') {
      this.datepicker.overlay.close();
    }
  }

  _shouldShowTimePicker(): boolean {
    return this.datepicker.unit === 'datetime' || this.datepicker.unit === 'time';
  }

  _getSelectedHour(): number {
    return this.datepicker.selectedHour || 0;
  }

  _getSelectedMinute(): number {
    return this.datepicker.selectedMinute || 0;
  }

  _getCalendarStartView(): 'month' | 'year' | 'multi-year' {
    if (this.datepicker.unit === 'month') {
      return 'year';
    }
    return 'month';
  }
}
