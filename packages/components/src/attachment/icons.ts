import { InjectionToken } from '@angular/core';

export interface NcAttachmentIcons {
  [key: string]: any;
  default: string;
  archive: string;
  code: string;
  image: string;
  audio: string;
  video: string;
  pdf: string;
  word: string;
  excel: string;
  ppt: string;
  csv: string;
}

export const DEFAULT_ATTACHMENC_ICONS: NcAttachmentIcons = {
  default: 'far fa-file-alt',
  archive: 'far fa-file-archive',
  code: 'far fa-file-code',
  image: 'far fa-file-image',
  audio: 'far fa-file-audio',
  video: 'far fa-file-video',
  pdf: 'far fa-file-pdf',
  word: 'far fa-file-word',
  excel: 'far fa-file-excel',
  ppt: 'far fa-file-powerpoint',
  csv: 'far fa-file-csv',
};

export const NC_ATTACHMENC_ICONS = new InjectionToken<NcAttachmentIcons>('nc-attachment-icons');
