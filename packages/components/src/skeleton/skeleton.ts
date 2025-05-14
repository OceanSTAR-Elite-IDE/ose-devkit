import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-skeleton',
  template: '<ng-content />',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-skeleton',
    '[class.nc-skeleton-circle]': 'circle',
    '[class.nc-skeleton-inline]': 'inline',
  },
})
export class NcSkeleton {
  private _circle = false;

  @Input()
  get circle(): boolean {
    return this._circle;
  }
  set circle(value: boolean) {
    if (value !== this.circle) {
      this._circle = coerceBooleanProperty(value);
    }
  }

  private _inline = false;

  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(value: boolean) {
    if (value !== this.inline) {
      this._inline = coerceBooleanProperty(value);
    }
  }
}
