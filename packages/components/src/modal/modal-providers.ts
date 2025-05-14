import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { NC_MODAL_DEFAULT_CONFIG, NcModalService } from './modal-serivce';
import { NcModalConfig } from './modal-config';

export function withModalService(config?: NcModalConfig): EnvironmentProviders {
  const providers: Provider[] = [{ provide: NC_MODAL_DEFAULT_CONFIG, useValue: config || {} }, NcModalService];

  return makeEnvironmentProviders(providers);
}
