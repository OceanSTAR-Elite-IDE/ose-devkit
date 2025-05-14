import { InjectionToken } from '@angular/core';

export interface NcNotifierIcons {
  [key: string]: any;
  info: string;
  success: string;
  warning: string;
  error: string;
  close: string;
}

export const DEFAULT_NOTIFIER_ICONS: NcNotifierIcons = {
  info: 'fas fa-info-circle',
  success: 'far fa-check-circle',
  warning: 'fas fa-exclamation-circle',
  error: 'far fa-times-circle',
  close: 'fas fa-times',
};

export const NC_NOTIFIER_ICONS = new InjectionToken<NcNotifierIcons>('nc-notifier-icons');
