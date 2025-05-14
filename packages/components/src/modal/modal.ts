import { AnimationEvent, transition, trigger } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EmbeddedViewRef, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { fadeInY, fadeOutY } from '@oceanstar/components/core';

import { NcModalConfig } from './modal-config';

export function throwNcModalContentAlreadyAttachedError() {
  throw Error('Attempting to attach modal content after content is already attached');
}

@Component({
  imports: [CommonModule, PortalModule, OverlayModule],
  selector: 'nc-modal',
  template: `
    <ng-template cdkPortalOutlet></ng-template>
    <button *ngIf="config.closable" class="nc-modal-close-button" (click)="exit()" type="button">
      <span aria-hidden="true">&times;</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [transition('void => *', fadeInY({ from: '-5%', to: 0 }, 0.2)), transition('* => exit', fadeOutY({ from: 0, to: '-5%' }, 0.2))]),
  ],
  host: {
    class: 'nc-modal',
    '[class.nc-modal-transparent]': '_config.transparent',
    '[style.width]': '_config.width',
    '[style.height]': '_config.height',
    '[@fade]': 'state',
    '(@fade.start)': 'onAnimationStart($event)',
    '(@fade.done)': 'onAnimationDone($event)',
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

  state: 'void' | 'enter' | 'exit' = 'enter';

  animationStateChanged = new EventEmitter<AnimationEvent>();

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
    this.animationStateChanged.emit(event);
  }

  onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  exit() {
    this.state = 'exit';
  }
}
