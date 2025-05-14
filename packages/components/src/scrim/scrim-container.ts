import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { NcScrim } from './scrim';

export const NC_SCRIM_CONTAINER = new InjectionToken<NcScrimContainer>('nc-scrim-container');

@Directive({
  selector: '[ncScrim]',
  host: {
    class: 'nc-scrim-container',
  },
})
export class NcScrimContainer implements OnChanges, OnDestroy {
  private _componentRef: ComponentRef<NcScrim>;

  element: HTMLElement;

  @Input('scrimText')
  set text(value: string) {
    this._componentRef.instance.text = value;
  }

  private _sctim: boolean = false;

  @Input('ncScrim')
  get scrim() {
    return this._sctim;
  }
  set scrim(value: boolean) {
    this._sctim = coerceBooleanProperty(value);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
  ) {
    const injector = Injector.create({
      providers: [{ provide: NC_SCRIM_CONTAINER, useValue: this }],
      parent: _viewContainerRef.injector,
    });
    this.element = this._elementRef.nativeElement;
    this._componentRef = this._viewContainerRef.createComponent(NcScrim, { injector });
  }

  ngOnChanges(change: SimpleChanges) {
    const scrimChange = change['scrim'];
    if (scrimChange && scrimChange.currentValue === true) {
      this._attachComponent();
    } else {
      this._detachComponent();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this._detachComponent();
      this._componentRef.destroy();
    }
  }

  private _attachComponent() {
    this._renderer.addClass(this.element, 'nc-scrim-active');
    this._renderer.appendChild(this.element, this._componentRef.location.nativeElement);
    this._componentRef.instance._left = this.element.scrollLeft;
    this._componentRef.instance._top = this.element.scrollTop;
    this._componentRef.instance.isOpen = true;
  }

  private _detachComponent() {
    this._renderer.removeClass(this.element, 'nc-scrim-active');
    this._renderer.removeChild(this.element, this._componentRef.location.nativeElement);
    this._componentRef.instance.isOpen = false;
  }
}
