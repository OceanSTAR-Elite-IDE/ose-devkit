import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'nc-progress-circle',
  templateUrl: 'progress-circle.html',
  host: {
    class: 'nc-progress-circle',
    '[class.nc-progress-colored]': 'colored',
  },
})
export class NcProgressCircle {
  private _max = 100;

  @Input()
  set max(value: number) {
    this._max = coerceNumberProperty(value, 100);
  }
  get max() {
    return this._max;
  }

  private _value = 0;

  @Input()
  set value(value: number) {
    this._value = coerceNumberProperty(value);
  }
  get value() {
    return this._value;
  }

  private _colored = false;

  @Input()
  get colored() {
    return this._colored;
  }
  set colored(value: BooleanInput) {
    this._colored = coerceBooleanProperty(value);
  }

  get percent() {
    const percent = (this.value / this.max) * 100;
    return Math.min(percent, 100);
  }

  private _radius = 60;

  @Input()
  get radius() {
    return this._radius;
  }
  set radius(value: number) {
    this._radius = coerceNumberProperty(value, 100);
  }

  get dasharray() {
    return this.radius * 2 * Math.PI;
  }

  get dashoffset() {
    const dasharray = this.dasharray;
    const percent = this.percent;
    const offset = (dasharray / 100) * percent;
    return dasharray - Math.min(dasharray, offset);
  }

  get width() {
    return this.radius * 2 + 6;
  }
  get height() {
    return this.radius * 2 + 6;
  }
}
