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

export interface NcContextMenuAnimationEvent {
  originalEvent: AnimationEvent;
  state?: 'start' | 'done';
}

@Component({
  imports: [CommonModule, PortalModule, OverlayModule],
  selector: 'nc-contextmenu-pane',
  template: `
    <div
      class="nc-overlay-container start-bottom-start-top"
      animation.enter="animate-fade-in"
      animation.leave="animate-fade-out"
      (animationstart)="onAnimationStart($event)"
      (animationend)="onAnimationDone($event)">
      <div class="nc-overlay-shadow"></div>
      <div class="nc-overlay-pane">
        <ng-template cdkPortalOutlet></ng-template>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-contextmenu-pane',
    '(contextmenu)': '_onInteractionEvent($event)',
  },
})
export class NcContextMenuPane extends BasePortalOutlet {

  @ViewChild(CdkPortalOutlet, { static: true }) private _portalOutlet!: CdkPortalOutlet;

  animationStateChanged = new EventEmitter<NcContextMenuAnimationEvent>();

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw new Error('Attempting to attach context menu content after content is already attached');
    }
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw new Error('Attempting to attach context menu content after content is already attached');
    }
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  onAnimationDone(event: AnimationEvent): void {

    const detail: NcContextMenuAnimationEvent = {
      originalEvent: event,
      state: 'done'
    };
    this.animationStateChanged.emit(detail);
  }

  onAnimationStart(event: AnimationEvent): void {
    const detail: NcContextMenuAnimationEvent = {
      originalEvent: event,
      state: 'start'
    };
    this.animationStateChanged.emit(detail);
  }

  _onInteractionEvent(event: Event) {
    event.stopPropagation();
    return false;
  }
}
