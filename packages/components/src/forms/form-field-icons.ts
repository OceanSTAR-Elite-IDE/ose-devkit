import { InjectionToken } from '@angular/core';

export interface NcFormFieldIcons {
  error: string;
  success: string;
  info: string;
}

export const DEFAULT_FORM_FIELD_ICONS: NcFormFieldIcons = {
  error: 'far fa-times-circle',
  success: 'far fa-check-circle',
  info: 'far fa-info-circle',
};

export const NC_FORM_FIELD_ICONS = new InjectionToken<NcFormFieldIcons>('nc-form-field-icons');
