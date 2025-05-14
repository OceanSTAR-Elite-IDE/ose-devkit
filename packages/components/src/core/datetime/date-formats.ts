/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { InjectionToken } from '@angular/core';

export type NcDateFormats = {
  parse: { dateInput: any };
  display: {
    dateInput: any;
    day: any;
    monthYearLabel: any;
    monthLabel: any;
  };
};

export const NC_DATE_FORMATS = new InjectionToken<NcDateFormats>('nc-date-formats');
