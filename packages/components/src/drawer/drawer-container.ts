import { Directive, ElementRef, InjectionToken } from '@angular/core';

export const NC_DRAWER_CONTAINER = new InjectionToken<NcDrawerContainer>('nc-drawer-container');

@Directive({
  selector: '[nc-drawer-container]',
  providers: [{ provide: NC_DRAWER_CONTAINER, useExisting: NcDrawerContainer }],
  host: {
    class: 'nc-drawer-container',
  },
})
export class NcDrawerContainer {
  readonly element: HTMLElement;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }
}
