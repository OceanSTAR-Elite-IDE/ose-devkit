import { Directive, Inject, InjectionToken, Injector, OnInit } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { DateAdapter } from '@oceanstar/components/core';

import { DateFilterFn } from './datepicker-control';
import { NcDatePickerInputBase } from './datepicker-input-base';
import { DateRange } from './selections';

export interface NcDateRangePickerParent<D> {
  _startDate: NcDateRangePart<D>;
  _endDate: NcDateRangePart<D>;
  min: D | null;
  max: D | null;
  dateFilter: DateFilterFn<D>;
}

export const NC_DATE_RANGE_PICKER_PARENT = new InjectionToken<NcDateRangePickerParent<unknown>>('nc-date-range-parent');

/**
 * 日期范围选择器区间控制器基类
 */
@Directive()
export abstract class NcDateRangePart<D> extends NcDatePickerInputBase<DateRange<D>, D> implements OnInit {
  // override ngControl!: NgControl | null;

  constructor(
    dateAdapter: DateAdapter<D>,
    @Inject(NC_DATE_RANGE_PICKER_PARENT) protected _rangePicker: NcDateRangePickerParent<D>,
    private _injector: Injector,
  ) {
    super(dateAdapter);
  }

  override ngOnInit() {
    const ngControl = this._injector.get(NgControl, null, { self: true });

    if (ngControl) {
      this.ngControl = ngControl;
    }
  }

  /** Gets the minimum date for the input. Used for validation. */
  _getMinDate(): D | null {
    return this._rangePicker.min;
  }

  /** Gets the maximum date for the input. Used for validation. */
  _getMaxDate(): D | null {
    return this._rangePicker.max;
  }

  /** Gets the date filter function. Used for validation. */
  protected _getDateFilter(): DateFilterFn<D> {
    return this._rangePicker.dateFilter;
  }
}

/**
 * 日期范围选择器的起始日期
 */
@Directive({
  selector: 'nc-date-range-start',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: NcDateRangeStart, multi: true },
    { provide: NG_VALIDATORS, useExisting: NcDateRangeStart, multi: true },
  ],
})
export class NcDateRangeStart<D> extends NcDateRangePart<D> {
  /** Validator that checks that the start date isn't after the end date. */
  private _startValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const end = this._model ? this._model.selection.end : null;
    return !start || !end || this._dateAdapter.compareDate(start, end) <= 0
      ? null
      : { NcDateRangeStartInvalid: { end: end, actual: start } };
  };

  protected _assignValueToModel(value: D): void {
    if (this._model) {
      const range = new DateRange(value, this._model.selection.end);
      this._model.updateSelection(range, this);
      this._valueChange(value);
    }
  }
  protected _getValueFromModel(modelValue: DateRange<D>) {
    return modelValue.start;
  }

  protected _validator = Validators.compose([...super._getValidators(), this._startValidator]);
}

/**
 * 日期范围选择器的结束日期
 */
@Directive({
  selector: 'nc-date-range-end',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: NcDateRangeEnd, multi: true },
    { provide: NG_VALIDATORS, useExisting: NcDateRangeEnd, multi: true },
  ],
})
export class NcDateRangeEnd<D> extends NcDateRangePart<D> {
  /** Validator that checks that the end date isn't before the start date. */
  private _endValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const start = this._model ? this._model.selection.start : null;
    return !end || !start || this._dateAdapter.compareDate(end, start) >= 0
      ? null
      : { NcDateRangeEndInvalid: { start: start, actual: end } };
  };

  protected _assignValueToModel(value: D): void {
    if (this._model) {
      const range = new DateRange(this._model.selection.start, value);
      this._model.updateSelection(range, this);
      this._valueChange(value);
    }
  }
  protected _getValueFromModel(modelValue: DateRange<D>) {
    return modelValue.end;
  }

  protected _validator = Validators.compose([...super._getValidators(), this._endValidator]);
}
