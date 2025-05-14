import { NgModule } from '@angular/core';

import { NcDateRangeEnd, NcDateRangeStart } from './date-range-parts';
import { NcDateRangePicker } from './date-range-picker';
import { NcDatePicker } from './datepicker';

@NgModule({
  imports: [NcDatePicker, NcDateRangePicker, NcDateRangeStart, NcDateRangeEnd],
  exports: [NcDatePicker, NcDateRangePicker, NcDateRangeStart, NcDateRangeEnd],
})
export class NcDatePickerModule {}
