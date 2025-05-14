import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NcOverlay, NcOverlayModule, NcOverlayPosition } from '@oceanstar/components/overlay';

@Component({
  imports: [CommonModule, NcOverlayModule],
  selector: 'nc-tooltip, [nc-tooltip]',
  templateUrl: 'tooltip.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-tooltip',
    '[class.nc-tooltip-trigger]': '!_isDirective',
    '(mouseenter)': '_onMouseEnter($event)',
    '(mouseleave)': '_onMouseLeave($event)',
  },
})
export class NcTooltip implements OnChanges {
  private _title = '';

  private _template!: TemplateRef<any> | null;

  readonly origin: CdkOverlayOrigin;

  @Input()
  set title(value: string) {
    this._title = value;
  }
  get title() {
    return this._title;
  }

  @Input()
  set template(value: TemplateRef<any> | null) {
    this._template = value;
  }
  get template() {
    return this._template;
  }

  @Input('nc-tooltip')
  set tooltip(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._template = value;
    } else {
      this._title = value;
      this._template = null;
    }
  }

  private _fixed = false;

  @Input()
  get fixed() {
    return this._fixed;
  }
  set fixed(value: BooleanInput) {
    this._fixed = coerceBooleanProperty(value);
  }

  get _isDirective() {
    const attributes = this._elementRef.nativeElement.attributes;
    return attributes && attributes['nc-tooltip'];
  }

  @Input() position: NcOverlayPosition | string = NcOverlayPosition.Top;

  @Output() afterOpen = new EventEmitter<any>();
  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeOpen = new EventEmitter<any>();
  @Output() beforeClosed = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @ViewChild(NcOverlay, { static: true }) overlay!: NcOverlay;

  constructor(private _elementRef: ElementRef) {
    this.origin = new CdkOverlayOrigin(_elementRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['title'] || changes['template'] || changes['tooltip'];
    const fixed = changes['fixed'];
    if (change && !change.firstChange) {
      /** 在内容更新之后提示框的位置需要更新，需要延迟执行，因为这时候画面还未渲染 */
      Promise.resolve().then(() => {
        this.overlay.forceUpdatePosition();
      });
    }

    if (fixed && !fixed.firstChange) {
      fixed.currentValue ? this.overlay.markOpen() : this.overlay.markClose();
    }
  }

  _onMouseEnter(_: Event) {
    if (this.fixed) {
      return;
    }
    this.overlay.markOpen();
  }

  _onMouseLeave(_: Event) {
    if (this.fixed) {
      return;
    }
    this.overlay.markClose();
  }

  _afterOpen(event: any) {
    this.afterOpen.next(event);
  }

  _afterClosed(event: any) {
    this.afterClosed.next(event);
  }

  _beforeOpen(event: any) {
    this.beforeOpen.next(event);
  }

  _beforeClosed(event: any) {
    this.beforeClosed.next(event);
  }

  _positionChange(change: ConnectedOverlayPositionChange) {
    this.positionChange.next(change);
  }
}
