import { transition, trigger } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NgControl } from '@angular/forms';
import {
  DateAdapter,
  fadeIn,
  fadeOut,
  NC_DATE_FORMATS,
  NcDateFormats,
  NcPseudoInputModule,
} from '@oceanstar/components/core';
import { NcFormFieldControl } from '@oceanstar/components/forms';

import { NcOverlayModule } from '../overlay';
import {
  NC_DATE_RANGE_PICKER_PARENT,
  NcDateRangeEnd,
  NcDateRangePickerParent,
  NcDateRangeStart,
} from './date-range-parts';
import { NcDatePickerBase } from './datepicker-base';
import { NC_DATE_PICKER_CONTROL } from './datepicker-control';
import { NC_DATEPICKER_ICONS, NcDatePickerIcons } from './datepicker-icons';
import {
  DateRange,
  NC_CALENDAR_RANGE_STRATEGY_PROVIDER,
  NC_RANGE_DATE_SELECTION_MODEL_PROVIDER,
  NcDateSelectionModel,
} from './selections';

let datepickerUid = 0;

@Component({
  imports: [CommonModule, A11yModule, PortalModule, NcOverlayModule, NcPseudoInputModule],
  selector: 'nc-date-range-picker',
  templateUrl: 'date-range-picker.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-datepicker nc-date-range-picker',
    '(click)': '_onClick($event)',
  },
  animations: [trigger('fade', [transition('* => void', fadeOut(0.15)), transition('void => *', fadeIn(0.15))])],
  providers: [
    { provide: NcFormFieldControl, useExisting: NcDateRangePicker },
    { provide: NC_DATE_PICKER_CONTROL, useExisting: NcDateRangePicker },
    { provide: NC_DATE_RANGE_PICKER_PARENT, useExisting: NcDateRangePicker },
    NC_RANGE_DATE_SELECTION_MODEL_PROVIDER,
    NC_CALENDAR_RANGE_STRATEGY_PROVIDER,
  ],
})
export class NcDateRangePicker<D>
  extends NcDatePickerBase<DateRange<D>, D>
  implements NcDateRangePickerParent<D>, NcFormFieldControl<DateRange<D>>, AfterContentInit, OnChanges
{
  id: string = `nc-date-range-picker-${datepickerUid++}`;

  ngControl: NgControl | null;

  _displayValue = '';

  private _placeholder = '';

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _required = false;

  @Input()
  get required(): boolean {
    return this._startDate.required || this._endDate.required || this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  private _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }

  @ContentChild(NcDateRangeStart) _startDate!: NcDateRangeStart<D>;

  @ContentChild(NcDateRangeEnd) _endDate!: NcDateRangeEnd<D>;

  constructor(
    elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(NC_DATEPICKER_ICONS) icons: NcDatePickerIcons,
    @Inject(NC_DATE_FORMATS) dateFormats: NcDateFormats,
    changeDetectorRef: ChangeDetectorRef,
    dateAdapter: DateAdapter<D>,
    model: NcDateSelectionModel<DateRange<D>, D>,
    @Optional() @Self() control: ControlContainer,
  ) {
    super(elementRef, tabIndex, icons, dateFormats, changeDetectorRef, dateAdapter, model);

    this.ngControl = control as any;
  }

  ngAfterContentInit() {
    if (this._startDate) {
      this._startDate._registerModel(this._model);
    }
    if (this._endDate) {
      this._endDate._registerModel(this._model);
    }
  }

  _isActivated() {
    return !this.disabled;
  }

  _getStartValue() {
    return this._startDate?.value || this._endDate?.value;
  }

  getErrors() {
    return {
      ...this._startDate.ngControl?.errors,
      ...this._endDate.ngControl?.errors,
    };
  }

  protected _getValueFromModel(modelValue: DateRange<D>) {
    return modelValue.start;
  }

  protected _formatValue(modelValue: DateRange<D>) {
    const startValue = this._formatPartValue(modelValue.start);
    const endValue = this._formatPartValue(modelValue.end);
    if (startValue || endValue) {
      this._displayValue = `${this._formatPartValue(modelValue.start)} - ${this._formatPartValue(modelValue.end)}`;
    } else {
      this._displayValue = '';
    }
  }

  protected _getDefaultModelValue(): DateRange<D> {
    return new DateRange<D>(null, null);
  }

  private _formatPartValue(value: D | null) {
    return value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
  }
}
