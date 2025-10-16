import { Observable } from 'rxjs';

import { ElementRef, InjectionToken } from '@angular/core';

/** 甘特图视图类型 */
export type NcGanttCalendarType = 'daily' | 'weekly' | 'monthly';

/**
 * 甘特图容器接口
 */
export interface NcGanttContainer<D> {
  calendarType: NcGanttCalendarType;

  elementRef: ElementRef;

  dataChange: Observable<{ minDate: D; maxDate: D; calendarType: NcGanttCalendarType }>;
}

export const NC_GANTT_CONTAINER = new InjectionToken<NcGanttContainer<unknown>>('NC_GANTT_CONTAINER');
