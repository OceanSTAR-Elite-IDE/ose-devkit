import { ModuleWithProviders, NgModule } from '@angular/core';

import { NC_PAGINATION_CONFIG, NcPaginationConfig } from './pagination-config';
import { NcPagination } from './pagination';

@NgModule({
  imports: [NcPagination],
  exports: [NcPagination],
})
export class NcPaginationModule {
  public static withConfig(config?: NcPaginationConfig): ModuleWithProviders<NcPaginationModule> {
    return {
      ngModule: NcPaginationModule,
      providers: [{ provide: NC_PAGINATION_CONFIG, useValue: config || new NcPaginationConfig() }],
    };
  }
}
