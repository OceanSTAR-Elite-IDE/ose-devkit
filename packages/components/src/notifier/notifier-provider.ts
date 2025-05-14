import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { NcNotifierAnimation } from './notifier-animation';
import { NcNotifierOptions } from './notifier-config';
import { NcNotifierQueue } from './notifier-queue';
import {
  NC_NOTIFIER_CONFIG,
  NC_NOTIFIER_OPTIONS,
  notifierCustomConfigFactory,
  notifierDefaultConfigFactory,
} from './notifier-tokens';
import { NcNotifierService } from './notifier.service';

export function withNotifierService(options?: NcNotifierOptions): EnvironmentProviders {
  const providers: Provider[] = [];

  providers.push({ provide: NC_NOTIFIER_OPTIONS, useValue: options || {} });

  if (options) {
    providers.push({
      deps: [NC_NOTIFIER_OPTIONS],
      provide: NC_NOTIFIER_CONFIG,
      useFactory: notifierCustomConfigFactory,
    });
  } else {
    providers.push({ provide: NC_NOTIFIER_CONFIG, useFactory: notifierDefaultConfigFactory });
  }

  providers.push(...[NcNotifierAnimation, NcNotifierQueue, NcNotifierService]);

  return makeEnvironmentProviders(providers);
}
