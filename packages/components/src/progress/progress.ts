import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'nc-progress',
  templateUrl: 'progress.html',
  host: {
    class: 'nc-progress',
    '[class.nc-progress-colored]': 'colored',
  },
})
export class NcProgress {
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
    return percent > 100 ? 100 : percent;
  }
}
