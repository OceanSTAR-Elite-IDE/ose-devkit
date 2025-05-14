import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'nc-badge, [nc-badge]',
  template: `
    <svg class="nc-badge-dot" viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="3" />
    </svg>
    <ng-content></ng-content>
    <button class="nc-badge-close" (click)="onClose()" type="button">
      <svg viewBox="0 0 14 14">
        <path d="M4 4l6 6m0-6l-6 6" />
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-badge',
    '[class.nc-badge-reverse]': 'reverse',
    '[class.nc-badge-dotted]': 'dotted',
    '[class.nc-badge-observed]': 'afterClosed.observed || beforeClosed.observed',
  },
})
export class NcBadge implements AfterViewInit, OnDestroy {
  _dotted = false;

  _observed = false;

  @Input() color: string = '';

  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeClosed = new EventEmitter<any>();

  @Input()
  get dotted() {
    return this._dotted;
  }
  set dotted(value: BooleanInput) {
    this._dotted = coerceBooleanProperty(value);
  }

  private _reverse: boolean = false;

  @Input()
  set reverse(value: BooleanInput) {
    this._reverse = coerceBooleanProperty(value);
  }
  get reverse() {
    return this._reverse;
  }

  constructor(
    private _elementRef: ElementRef,
    // private _componentRef: ComponentRef<NcBadgeComponent>,
    private _renderer: Renderer2,
  ) {
    // console.log(_componentRef);
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.afterClosed.complete();
    this.beforeClosed.complete();
  }

  onClose() {
    this.afterClosed.emit(this);
    this.beforeClosed.emit(this);
    // this._elementRef
  }

  // 重置容器的 position 属性
  // private _resetPosition() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const style = window.getComputedStyle(this._elementRef.nativeElement.parentElement);
  //     if (style.position !== 'absolute' || style.position !== 'absolute') {
  //       this._originalPosition = style.position;
  //       this._renderer.setStyle(this._elementRef.nativeElement.parentElement, 'position', 'relative');
  //     }
  //   }
  // }

  // 清理 position 属性
  // private _clearPosition() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     if (this._originalPosition) {
  //       this._renderer.removeStyle(this._elementRef.nativeElement.parentElement, 'position');
  //     }
  //   }
  // }
}
