import { InjectionToken } from '@angular/core';

export class NcPaginationConfig {
  previousLabel: string = '«';
  nextLabel: string = '»';
  itemSize: number = 2;
  pageSize: number = 10;
}

export const NC_PAGINATION_CONFIG = new InjectionToken<NcPaginationConfig>('nc-pagination-config');
