/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Subscription } from 'rxjs';

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
import { DateAdapter } from '@oceanstar/components/core';

import { NcCalendarUserEvent } from './calendar-body';
import { NcDatePickerCalendar } from './calendar';
import { NC_DATE_PICKER_CONTROL, NcDatePickerControl } from './datepicker-control';
import {
  DateRange,
  ExtractDateTypeFromSelection,
  NC_DATE_RANGE_SELECTION_STRATEGY,
  NcDateRangeSelectionStrategy,
  NcDateSelectionModel,
} from './selections';

@Component({
  imports: [NcDatePickerCalendar],
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
    const selection = this._model.selection;
    const value = event.value;
    const isRange = selection instanceof DateRange;

    // If we're selecting a range and we have a selection strategy, always pass the value through
    // there. Otherwise don't assign null values to the model, unless we're selecting a range.
    // A null value when picking a range means that the user cancelled the selection (e.g. by
    // pressing escape), whereas when selecting a single value it means that the value didn't
    // change. This isn't very intuitive, but it's here for backwards-compatibility.
    if (isRange && this._rangeSelectionStrategy) {
      const newSelection = this._rangeSelectionStrategy.selectionFinished(
        value,
        selection as unknown as DateRange<D>,
        event.event,
      );
      this._model.updateSelection(newSelection as unknown as S, this);
    } else if (value && (isRange || !this._dateAdapter.sameDate(value, selection as unknown as D))) {
      this._model.add(value);
    }

    if (!this._model || this._model.isComplete()) {
      this.datepicker.overlay.close();
    }
  }

  _getSelected() {
    return this._model.selection as unknown as D | DateRange<D> | null;
  }
}
