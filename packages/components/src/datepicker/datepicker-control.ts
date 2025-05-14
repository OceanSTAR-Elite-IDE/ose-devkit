import { Observable } from 'rxjs';

import { InjectionToken } from '@angular/core';
import { NcOverlay } from '@oceanstar/components/overlay';

import { NcCalendarCellClassFunction } from './calendar-body';

/** Function that can be used to filter out dates from a calendar. */
export type DateFilterFn<D> = (date: D | null) => boolean;

/** Form control that can be associated with a datepicker. */
export interface NcDatePickerControl<D> {
  id?: string;
  startAt: D | null;
  min: D | null;
  max: D | null;
  dateClass: NcCalendarCellClassFunction<D>;
  dateFilter: DateFilterFn<D>;
  overlay: NcOverlay;
  _stateChanges: Observable<void>;
}

export const NC_DATE_PICKER_CONTROL = new InjectionToken<NcDatePickerControl<unknown>>('nc-datepicker-control');
