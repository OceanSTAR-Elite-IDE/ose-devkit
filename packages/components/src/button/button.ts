import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'button[nc-button], a[nc-button]',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-button',
    '[class.nc-button-expanded]': 'expanded',
    '[class.nc-button-reverse]': 'reverse',
  },
})
export class NcButton {
  private _expanded: boolean = false;

  @Input()
  set expanded(value: BooleanInput) {
    this._expanded = coerceBooleanProperty(value);
  }
  get expanded() {
    return this._expanded;
  }

  private _reverse: boolean = false;

  @Input()
  set reverse(value: BooleanInput) {
    this._reverse = coerceBooleanProperty(value);
  }
  get reverse() {
    return this._reverse;
  }
}
