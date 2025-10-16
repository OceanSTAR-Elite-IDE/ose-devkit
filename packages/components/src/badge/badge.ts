import { BooleanInput } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'nc-badge, [nc-badge]',
  template: `
    <span class="nc-badge-dot"></span>
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
    '[class.nc-badge-reverse]': 'reverse()',
    '[class.nc-badge-dotted]': 'dotted()',
    '[class.nc-badge-observed]': 'afterClosed.observed || beforeClosed.observed',
  },
})
export class NcBadge implements AfterViewInit, OnDestroy {

  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeClosed = new EventEmitter<any>();

  dotted = input<BooleanInput>();

  reverse = input<BooleanInput>();

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.afterClosed.complete();
    this.beforeClosed.complete();
  }

  onClose() {
    this.afterClosed.emit(this);
    this.beforeClosed.emit(this);
  }
}
