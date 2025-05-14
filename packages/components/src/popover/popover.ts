import { CdkOverlayOrigin, ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NcOverlay, NcOverlayModule, NcOverlayPosition } from '@oceanstar/components/overlay';

import { NC_POPOVER_PARENT, NcPopoverParent } from './popover-pane';

@Component({
  imports: [CommonModule, NcOverlayModule],
  selector: '[nc-popover]',
  templateUrl: 'popover.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'overlay.toggle()',
  },
  providers: [{ provide: NC_POPOVER_PARENT, useExisting: NcPopover }],
})
export class NcPopover implements NcPopoverParent {
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

  @Input('nc-popover')
  set popover(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      this._template = value;
    } else {
      this._title = value;
      this._template = null;
    }
  }

  @Input() position: NcOverlayPosition | string = NcOverlayPosition.Top;

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  @Output() afterOpen = new EventEmitter<any>();
  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeOpen = new EventEmitter<any>();
  @Output() beforeClosed = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @ViewChild(NcOverlay, { static: true }) overlay!: NcOverlay;

  constructor(private _elementRef: ElementRef) {
    this.origin = new CdkOverlayOrigin(this._elementRef);
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
