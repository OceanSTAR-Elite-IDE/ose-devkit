import { ViewContainerRef } from '@angular/core';

export class NcModalConfig {
  id?: string;
  top?: string = '80px';
  width?: number | string = '600px';
  height?: number | string = 'auto';
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string = '80vw';
  maxHeight?: number | string;
  title?: string;
  closable?: boolean = true;
  position?: '';
  data?: any = {};
  panelClass?: string = '';
  hasBackdrop?: boolean = true;
  backdropClass?: string = 'nc-modal-backdrop';
  centerVertically?: boolean = false;
  transparent?: boolean = false;
  viewContainerRef?: ViewContainerRef;
}
