import { OverlayModule } from '@angular/cdk/overlay';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  PortalModule,
  TemplatePortal
} from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  EmbeddedViewRef,
  EventEmitter,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { NcModalConfig } from './modal-config';

export function throwNcModalContentAlreadyAttachedError() {
  throw Error('Attempting to attach modal content after content is already attached');
}

export interface NcModalAnimationEvent {
  phaseName: 'start' | 'done';
  toState: 'enter' | 'exit';
  originalEvent: AnimationEvent;
}

@Component({
  imports: [CommonModule, PortalModule, OverlayModule],
  selector: 'nc-modal',
  template: `
    <div
      class="nc-modal-surface"
      (animationstart)="onAnimationStart($event)"
      (animationend)="onAnimationDone($event)">
      <ng-template cdkPortalOutlet></ng-template>
      <button *ngIf="config.closable" class="nc-modal-close-button" (click)="exit()" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-modal',
    '[class.nc-modal-transparent]': '_config.transparent',
    '[style.width]': '_config.width',
    '[style.height]': '_config.height',
  },
})
export class NcModal extends BasePortalOutlet {
  @ViewChild(CdkPortalOutlet, { static: true }) private _portalOutlet!: CdkPortalOutlet;

  _config!: NcModalConfig;

  set config(value: NcModalConfig) {
    this._config = value;
  }
  get config() {
    return this._config;
  }

  state: 'enter' | 'exit' = 'enter';

  animationStateChanged = new EventEmitter<NcModalAnimationEvent>();

  constructor() {
    super();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throwNcModalContentAlreadyAttachedError();
    }
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throwNcModalContentAlreadyAttachedError();
    }
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  onAnimationDone(event: AnimationEvent): void {
    const detail: NcModalAnimationEvent = {
      phaseName: 'done',
      toState: this.state,
      originalEvent: event,
    };
    this.animationStateChanged.emit(detail);
  }

  onAnimationStart(event: AnimationEvent): void {
    const detail: NcModalAnimationEvent = {
      phaseName: 'start',
      toState: this.state,
      originalEvent: event,
    };
    this.animationStateChanged.emit(detail);
  }

  exit() {
    this.state = 'exit';
  }
}
