import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { A11yModule } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Attribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl, ValidatorFn } from '@angular/forms';
import { DateAdapter, NC_DATE_FORMATS, NcDateFormats, NcPseudoInputModule } from '../core';
import { NcFormFieldControl } from '../forms';
import { BOTTOM_LEFT, NcOverlay, NcOverlayModule, TOP_LEFT } from '../overlay';

import { NcCalendarCellClassFunction } from './calendar-body';
import { NcDatePickerContent } from './datepicker-content';
import { DateFilterFn, DatePickerUnit, NC_DATE_PICKER_CONTROL, NcDatePickerControl } from './datepicker-control';
import { DEFAULT_DATEPICKER_ICONS, NC_DATEPICKER_ICONS, NcDatePickerIcons } from './datepicker-icons';
import { NcDatePickerInputBase } from './datepicker-input-base';
import { NC_SINGLE_DATE_SELECTION_MODEL_PROVIDER, NcDateSelectionModel } from './selections';

let datepickerUid = 0;

// const _NcDatePickerInputBase: NcOverlayControlCtor &
//   typeof NcDatePickerInputBase = mixinOverlayControl(NcDatePickerInputBase);

  @Component({
  imports: [CommonModule, A11yModule, PortalModule, NcOverlayModule, NcPseudoInputModule],
  selector: 'nc-datepicker',
  templateUrl: 'datepicker.html',
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    class: 'nc-datepicker',
    '(click)': '_onClick($event)',
  },
  providers: [
    { provide: NcFormFieldControl, useExisting: NcDatePicker },
    { provide: NC_DATE_PICKER_CONTROL, useExisting: NcDatePicker },
    NC_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
  ],
})
export class NcDatePicker<D>
  extends NcDatePickerInputBase<D | null, D>
  implements NcFormFieldControl<D>, NcDatePickerControl<D>, AfterViewInit, OnChanges, OnDestroy
{
  private _overlayToggle = new Subject<boolean>();

  _displayValue = '';

  id = `nc-datepicker-${datepickerUid++}`;

  tabIndex: number;

  _portal!: Portal<any>;

  _positionPairs: ConnectionPositionPair[] = [BOTTOM_LEFT, TOP_LEFT];

  private _startAt!: D | null;

  @Input()
  get startAt(): D | null {
    return this._startAt || this._getStartValue();
  }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  private _min!: D | null;

  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  private _max!: D | null;

  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null | undefined) {
    this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  private _placeholder = '';

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }
  get placeholder() {
    return this._placeholder;
  }

  private _readonly = false;

  @Input()
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }
  get readonly() {
    return this._readonly;
  }

  private _unit: DatePickerUnit = 'date';

  @Input()
  get unit(): DatePickerUnit {
    return this._unit;
  }
  set unit(value: DatePickerUnit) {
    this._unit = value;
    this._stateChanges.next();
  }

  private _selectedHour = 0;
  private _selectedMinute = 0;

  @Input()
  get selectedHour(): number {
    return this._selectedHour;
  }
  set selectedHour(value: number) {
    this._selectedHour = Math.max(0, Math.min(23, value));
    this._updateTimeInValue();
  }

  @Input()
  get selectedMinute(): number {
    return this._selectedMinute;
  }
  set selectedMinute(value: number) {
    this._selectedMinute = Math.max(0, Math.min(59, value));
    this._updateTimeInValue();
  }

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass!: NcCalendarCellClassFunction<D>;

  @Input() dateFilter!: DateFilterFn<D>;

  @Output() afterOpen = new EventEmitter<any>();
  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeOpen = new EventEmitter<any>();
  @Output() beforeClosed = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @ViewChild(NcOverlay, { static: true }) overlay!: NcOverlay;

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet!: CdkPortalOutlet;

  _validator!: ValidatorFn;

  readonly origin: CdkOverlayOrigin;

  readonly _stateChanges = new Subject<void>();

  constructor(
    public _elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(NC_DATEPICKER_ICONS) public icons: NcDatePickerIcons,
    @Inject(NC_DATE_FORMATS) private _dateFormats: NcDateFormats,
    private _changeDetectorRef: ChangeDetectorRef,
    dateAdapter: DateAdapter<D>,
    _model: NcDateSelectionModel<D | null, D>,
    @Optional() @Self() public override ngControl: NgControl,
  ) {
    super(dateAdapter);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this._registerModel(_model);

    this.origin = new CdkOverlayOrigin(this._elementRef);

    this.icons = { ...DEFAULT_DATEPICKER_ICONS, ...icons };

    this.tabIndex = parseInt(tabIndex) || 0;

    this._overlayToggle.pipe(debounceTime(10)).subscribe(open => (open ? this.overlay.open() : this.overlay.toggle()));

    this._model.selectionChanged.subscribe(value => {
      this._formatValue(value.selection);
      this._extractTimeFromValue(value.selection);
    });
  }
  focused?: boolean;
  empty?: boolean;

  getErrors() {
    return this.ngControl?.errors || null;
  }

  _isActivated(): boolean {
    return !this.disabled;
  }

  ngAfterViewInit() {
    this._changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['value'] || changes['startAt'] || changes['min'] || changes['max'];
    if (change && !change.firstChange) {
      this._changeDetectorRef.markForCheck();
    }
    this._stateChanges.next();
  }

  override ngOnDestroy() {
    this._stateChanges.complete();
  }

  focus() {
    this.overlay.open();
  }

  select(date: D): void {
    this._model.add(date);
    this._valueChange(date);
  }

  _onAfterOpen(event: any) {
    this.afterOpen.next(event);
  }

  _onAfterClosed(event: any) {
    this.afterClosed.next(event);
    this._portal.detach();
  }

  _onBeforeOpen(event: any) {
    this._portal = new ComponentPortal(NcDatePickerContent);
    this.beforeOpen.next(event);
  }

  _onBeforeClosed(event: any) {
    this.beforeClosed.next(event);
  }

  _onPositionChange(change: ConnectedOverlayPositionChange) {
    this.positionChange.next(change);
  }

  _onClick(event: Event) {
    if (!this.disabled) {
      this.overlay.toggle();
    }
    event.stopPropagation();
  }

  _onClear(event: Event) {
    if (!this.disabled) {
      this._model.updateSelection(this._getDefaultModelValue(), this);
    }
    event.stopPropagation();
    this._valueChange(this._getDefaultModelValue());
  }

  _assignValueToModel(value: D | null): void {
    if (this._model) {
      value = this._dateAdapter.deserialize(value);
      this._model.updateSelection(value, this);
      this._valueChange(value);
    }
  }

  _getValueFromModel(modelValue: D): D {
    return modelValue;
  }

  _getMinDate(): D | null {
    return this.min;
  }

  _getMaxDate(): D | null {
    return this.max;
  }

  _getDateFilter(): DateFilterFn<D> {
    return this.dateFilter;
  }

  _getStartValue() {
    return this._model?.selection;
  }

  protected _formatValue(modelValue: D | null) {
    if (modelValue) {
      if (this.unit === 'time') {
        this._displayValue = this._formatTimeOnly(modelValue);
      } else if (this.unit === 'datetime') {
        this._displayValue = this._formatDateTime(modelValue);
      } else if (this.unit === 'month') {
        this._displayValue = this._formatMonthOnly(modelValue);
      } else {
        this._displayValue = this._dateAdapter.format(modelValue, this._dateFormats.display.dateInput);
      }
    } else {
      this._displayValue = '';
    }
  }

  private _formatTimeOnly(date: D): string {
    if (!date) return '';
    const jsDate = date as unknown as Date;
    const hours = jsDate.getHours().toString().padStart(2, '0');
    const minutes = jsDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private _formatDateTime(date: D): string {
    if (!date) return '';
    const dateStr = this._dateAdapter.format(date, this._dateFormats.display.dateInput);
    const timeStr = this._formatTimeOnly(date);
    return `${dateStr} ${timeStr}`;
  }

  private _formatMonthOnly(date: D): string {
    if (!date) return '';
    const jsDate = date as unknown as Date;
    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  private _extractTimeFromValue(value: D | null) {
    if (value && (this.unit === 'datetime' || this.unit === 'time')) {
      const jsDate = value as unknown as Date;
      this._selectedHour = jsDate.getHours();
      this._selectedMinute = jsDate.getMinutes();
    }
  }

  private _updateTimeInValue() {
    if ((this.unit === 'datetime' || this.unit === 'time') && this._model.selection) {
      const currentValue = this._model.selection as unknown as Date;
      const newDate = new Date(currentValue.getTime());
      newDate.setHours(this._selectedHour);
      newDate.setMinutes(this._selectedMinute);
      this._model.updateSelection(newDate as D, this);
      this._valueChange(newDate as D);
      this._formatValue(newDate as D);
    }
  }

  onTimeChange(type: 'hour' | 'minute', value: number) {
    if (type === 'hour') {
      this.selectedHour = value;
    } else {
      this.selectedMinute = value;
    }
  }

  protected _getDefaultModelValue(): D | null {
    return null;
  }
}
