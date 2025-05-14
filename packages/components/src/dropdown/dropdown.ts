import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ObserversModule } from '@angular/cdk/observers';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NcOverlay, NcOverlayModule, NcOverlayPosition } from '@oceanstar/components/overlay';

import { NC_DROPDOWN_PARENT, NcDropdownPane, NcDropdownParent } from './dropdown-pane';

export declare type NcDropdownTriggerType = '' | 'hover' | 'click';

@Component({
  imports: [ObserversModule, NcOverlayModule],
  selector: 'nc-dropdown, [nc-dropdown]',
  templateUrl: 'dropdown.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': '_onClick($event)',
    '(mouseenter)': '_onMouseEnter($event)',
    '(mouseleave)': '_onMouseLeave($event)',
  },
  providers: [{ provide: NC_DROPDOWN_PARENT, useExisting: NcDropdown }],
})
export class NcDropdown implements NcDropdownParent {
  readonly origin: CdkOverlayOrigin;

  @Input() position: NcOverlayPosition | string = NcOverlayPosition.BottomLeft;

  @Input() trigger: NcDropdownTriggerType = 'hover';

  private _ignore = false;

  @Input()
  get ignore() {
    return this._ignore;
  }
  set ignore(value: boolean) {
    this._ignore = coerceBooleanProperty(value);
  }

  @Output() afterOpen = new EventEmitter<any>();
  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeOpen = new EventEmitter<any>();
  @Output() beforeClosed = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @ViewChild(NcOverlay, { static: true }) overlay!: NcOverlay;

  @ContentChild(NcDropdownPane) pane!: NcDropdownPane;

  constructor(_elementRef: ElementRef) {
    this.origin = new CdkOverlayOrigin(_elementRef);
  }

  _onClick(_: Event) {
    if (!this.ignore) {
      if (this.trigger === 'click') {
        this.overlay.toggle();
      }
    }
  }

  _onMouseEnter(_: Event) {
    if (!this.ignore) {
      if (this.trigger === 'hover') {
        this.overlay.markOpen();
      }
    }
  }

  _onMouseLeave(_: Event) {
    if (!this.ignore) {
      if (this.trigger === 'hover') {
        this.overlay.markClose();
      }
    }
  }

  _afterOpen(event: any) {
    this.afterOpen.next(this);
  }

  _afterClosed(event: any) {
    this.afterClosed.next(this);
  }

  _beforeOpen(event: any) {
    this.beforeOpen.next(this);
  }

  _beforeClosed(event: any) {
    this.beforeClosed.next(this);
  }

  _positionChange(change: ConnectedOverlayPositionChange) {
    this.positionChange.next(change);
  }
}
