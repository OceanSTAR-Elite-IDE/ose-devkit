import { EnvironmentProviders, inject, makeEnvironmentProviders, Provider, Type } from '@angular/core';

import { NC_VALIDATION_TRANSFOMER, NcFormValidationTransformer, NcValidationTransformer } from './form-validation';

export const formDefaultTransformerFactory = () => {
  const transformer = inject(NC_VALIDATION_TRANSFOMER);
  return transformer || new NcFormValidationTransformer();
};

export function withValidationTransformer(transformer?: Type<NcValidationTransformer>): EnvironmentProviders {
  const providers: Provider[] = [];
  if (transformer) {
    providers.push({ provide: NC_VALIDATION_TRANSFOMER, useClass: transformer });
  } else {
    providers.push({ provide: NC_VALIDATION_TRANSFOMER, useClass: transformer || NcFormValidationTransformer });
  }

  return makeEnvironmentProviders(providers);
}
