import { InjectionToken } from '@angular/core';

export interface NcDatePickerIcons {
  caret: string;
  clear: string;
}

export const DEFAULT_DATEPICKER_ICONS: NcDatePickerIcons = {
  caret: 'far fa-calendar-alt',
  clear: 'fa fa-times',
};

export const NC_DATEPICKER_ICONS = new InjectionToken<NcDatePickerIcons>('nc-datepicker-icons');
