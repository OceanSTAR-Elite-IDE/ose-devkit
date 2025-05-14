import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-button-group',
  template: `<ng-content select="nc-button" />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'nc-button-group',
  },
})
export class NcButtonGroup {
  private _expanded: boolean = false;

  @Input()
  set expanded(value: BooleanInput) {
    this._expanded = coerceBooleanProperty(value);
  }
  get expanded() {
    return this._expanded;
  }
}
