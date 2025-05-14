import { transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { fadeIn, fadeOut } from '@oceanstar/components/core';

import { NC_SCRIM_CONTAINER, NcScrimContainer } from './scrim-container';

@Component({
  imports: [CommonModule],
  selector: '[nc-scrim], nc-scrim',
  templateUrl: 'scrim.html',
  encapsulation: ViewEncapsulation.None,
  animations: [trigger('fade', [transition('void => *', fadeIn(0.15)), transition('* => void', fadeOut(0.15))])],
  host: {
    class: 'nc-scrim',
    '[class.nc-scrim-visible]': 'isOpen',
    '[class.nc-scrim-centerial]': 'centerial',
    '[class.nc-scrim-dark]': 'dark',
    '[style.top.px]': '_top',
    '[style.left.px]': '_left',
  },
})
export class NcScrim implements OnInit, OnChanges, OnDestroy {
  private _parentElement: HTMLElement;

  _top = 0;

  _left = 0;

  @Input() text = '';

  private _isOpen = false;

  @Input()
  get isOpen() {
    return this._isOpen;
  }
  set isOpen(value: BooleanInput) {
    this._isOpen = coerceBooleanProperty(value);
  }

  private _centerial = false;

  @Input()
  get centerial() {
    return this._centerial;
  }
  set centerial(value: BooleanInput) {
    this._centerial = coerceBooleanProperty(value);
  }

  private _dark = false;

  @Input()
  get dark() {
    return this._dark;
  }
  set dark(value: BooleanInput) {
    this._dark = coerceBooleanProperty(value);
  }

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(NC_SCRIM_CONTAINER) private container: NcScrimContainer,
  ) {
    this._parentElement = this._elementRef.nativeElement.parentElement;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && !this.container) {
      const style = window.getComputedStyle(this._parentElement);
      if (style.position !== 'absolute' && style.position !== 'relative') {
        this._renderer.addClass(this._parentElement, 'nc-scrim-container');
      }
    }
  }

  ngOnChanges(change: SimpleChanges) {
    const scrimChange = change['isOpen'];
    const parentElement = this._parentElement ?? this.container.element;
    if (scrimChange.currentValue === true) {
      this._renderer.addClass(parentElement, 'nc-scrim-active');
      this._left = this._parentElement.scrollLeft;
      this._top = this._parentElement.scrollTop;
    } else {
      this._renderer.removeClass(parentElement, 'nc-scrim-active');
    }
  }

  ngOnDestroy() {
    if (this._parentElement) {
      this._renderer.removeClass(this._parentElement, 'nc-scrim-container');
      this._renderer.removeClass(this._parentElement, 'nc-scrim-active');
    }
  }
}
