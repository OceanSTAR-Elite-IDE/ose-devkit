import { InjectionToken } from '@angular/core';

import { NcNotifierConfig, NcNotifierOptions } from './notifier-config';

// tslint:disable variable-name

/**
 * Injection Token for notifier options
 */
export const NC_NOTIFIER_OPTIONS: InjectionToken<NcNotifierOptions> = new InjectionToken<NcNotifierOptions>('nc-notifier-options');

/**
 * Injection Token for notifier configuration
 */
export const NC_NOTIFIER_CONFIG: InjectionToken<NcNotifierConfig> = new InjectionToken<NcNotifierConfig>('nc-notifier-config');

// tslint:enable variable-name

/**
 * Factory for a notifier configuration with custom options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @param   options - Custom notifier options
 * @returns - Notifier configuration as result
 */
export function notifierCustomConfigFactory(options: NcNotifierOptions): NcNotifierConfig {
  return new NcNotifierConfig(options);
}

/**
 * Factory for a notifier configuration with default options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @returns - Notifier configuration as result
 */
export function notifierDefaultConfigFactory(): NcNotifierConfig {
  return new NcNotifierConfig({});
}
