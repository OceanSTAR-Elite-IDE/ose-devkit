import { ModuleWithProviders, NgModule } from '@angular/core';

import { NcNotifier } from './notifier';
import { NcNotifierOptions } from './notifier-config';
import { NcNotifierContainer } from './notifier-container';
import { NC_NOTIFIER_CONFIG, NC_NOTIFIER_OPTIONS, notifierCustomConfigFactory } from './notifier-tokens';

/**
 * Notifier module
 */
@NgModule({
  exports: [NcNotifierContainer],
  imports: [NcNotifierContainer, NcNotifier],
})
export class NcNotifierModule {
  /**
   * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
   *
   * @param   [options={}] - Custom notifier options
   * @returns - Notifier module with custom providers
   */
  public static withConfig(options: NcNotifierOptions = {}): ModuleWithProviders<NcNotifierModule> {
    return {
      ngModule: NcNotifierModule,
      providers: [
        // Provide the options itself upfront (as we need to inject them as dependencies -- see below)
        {
          provide: NC_NOTIFIER_OPTIONS,
          useValue: options,
        },

        // Provide a custom notifier configuration, based on the given notifier options
        {
          deps: [NC_NOTIFIER_OPTIONS],
          provide: NC_NOTIFIER_CONFIG,
          useFactory: notifierCustomConfigFactory,
        },
      ],
    };
  }
}
