import { Subject } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DateAdapter, NC_DATE_FORMATS, NcDateFormats } from '@oceanstar/components/core';

import { NcCalendarCellClassFunction, NcCalendarUserEvent } from './calendar-body';
import { NcCalendarHeader } from './calendar-header';
import { createMissingDateImplError } from './datepicker-errors';
import { NcCalendarMonth } from './month';
import { NcCalendarMultiYear } from './multi-year';
import { DateRange } from './selections';
import { NcCalendarYear } from './year';

export type NcDatePickerViewType = 'month' | 'year' | 'multi-year';

@Component({
  imports: [CommonModule, NcCalendarHeader, NcCalendarMonth, NcCalendarYear, NcCalendarMultiYear],
  selector: 'nc-datepicker-calendar',
  templateUrl: 'calendar.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-datepicker-calendar',
  },
})
export class NcDatePickerCalendar<D> implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private _moveFocusOnNextTick = false;

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: NcDatePickerViewType = 'month';

  private _startAt!: D | null;

  @Input()
  get startAt(): D | null {
    return this._startAt;
  }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The currently selected date. */
  private _selected!: D | DateRange<D> | null;

  @Input()
  @Input()
  get selected(): D | DateRange<D> | null {
    return this._selected;
  }
  set selected(value: D | DateRange<D> | null) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
  }

  /** The minimum selectable date. */
  private _minDate!: D | null;

  @Input()
  get minDate(): D | null {
    return this._minDate;
  }
  set minDate(value: D | null) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The maximum selectable date. */
  private _maxDate!: D | null;

  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }
  set maxDate(value: D | null) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  stateChanges = new Subject<void>();

  /** Function used to filter which dates are selectable. */
  @Input() dateFilter!: (date: D) => boolean;

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass!: NcCalendarCellClassFunction<D>;

  /** Start of the comparison range. */
  @Input() comparisonStart!: D | null;

  /** End of the comparison range. */
  @Input() comparisonEnd!: D | null;

  @Output() readonly selectedChange: EventEmitter<D | null> = new EventEmitter<D | null>();

  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  @Output() readonly viewChanged: EventEmitter<NcDatePickerViewType> = new EventEmitter<NcDatePickerViewType>(true);

  @Output() readonly _userSelection: EventEmitter<NcCalendarUserEvent<D | null>> = new EventEmitter<
    NcCalendarUserEvent<D | null>
  >();

  @ViewChild(NcCalendarMonth) monthView!: NcCalendarMonth<D>;

  @ViewChild(NcCalendarYear) yearView!: NcCalendarYear<D>;

  @ViewChild(NcCalendarMultiYear) multiYearView!: NcCalendarMultiYear<D>;

  private _currentView!: NcDatePickerViewType;

  /** Whether the calendar is in month view. */
  get currentView(): NcDatePickerViewType {
    return this._currentView;
  }
  set currentView(value: NcDatePickerViewType) {
    const viewChangedResult = this._currentView !== value ? value : null;
    this._currentView = value;
    this._moveFocusOnNextTick = true;
    this._changeDetectorRef.markForCheck();
    if (viewChangedResult) {
      this.viewChanged.emit(viewChangedResult);
    }
  }

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  private _clampedActiveDate!: D;

  get activeDate(): D {
    return this._clampedActiveDate;
  }
  set activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(NC_DATE_FORMATS) private _dateFormats: NcDateFormats,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError('NC_DATE_FORMATS');
    }
  }

  ngAfterContentInit() {
    this.activeDate = this.startAt || this._dateAdapter.today();

    // Assign to the private property since we don't want to move focus on init.
    this._currentView = this.startView;
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['minDate'] || changes['maxDate'] || changes['dateFilter'];

    if (change && !change.firstChange) {
      const view = this._getCurrentViewComponent();

      if (view) {
        // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
        // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
        this._changeDetectorRef.detectChanges();
        view._init();
      }
    }

    this.stateChanges.next();
  }

  ngAfterViewChecked() {
    if (this._moveFocusOnNextTick) {
      this._moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  focusActiveCell() {
    this._getCurrentViewComponent()._focusActiveCell(false);
  }

  /** Updates today's date after an update of the active date */
  updateTodaysDate() {
    const currentView = this.currentView;
    let view: NcCalendarMonth<D> | NcCalendarYear<D> | NcCalendarMultiYear<D>;

    if (currentView === 'month') {
      view = this.monthView;
    } else if (currentView === 'year') {
      view = this.yearView;
    } else {
      view = this.multiYearView;
    }

    view._init();
  }

  /** Handles date selection in the month view. */
  _dateSelected(event: NcCalendarUserEvent<D | null>): void {
    const date = event.value;

    if (this.selected instanceof DateRange || (date && !this._dateAdapter.sameDate(date, this.selected))) {
      this.selectedChange.emit(date);
    }

    this._userSelection.emit(event);
  }

  /** Handles year selection in the multiyear view. */
  _yearSelectedInMultiYearView(normalizedYear: D) {
    this.yearSelected.emit(normalizedYear);
  }

  /** Handles month selection in the year view. */
  _monthSelectedInYearView(normalizedMonth: D) {
    this.monthSelected.emit(normalizedMonth);
  }

  /** Handles year/month selection in the multi-year/year views. */
  _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void {
    this.activeDate = date;
    this.currentView = view;
  }

  /** Returns the component instance that corresponds to the current calendar view. */
  private _getCurrentViewComponent() {
    return this.monthView || this.yearView || this.multiYearView;
  }
}
