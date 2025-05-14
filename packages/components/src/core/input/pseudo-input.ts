import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Attribute, Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'nc-pseudo-input',
  template: `
    <div *ngIf="value" class="nc-pseudo-value">{{ value }}</div>
    <div *ngIf="!value" class="nc-pseudo-placeholder">{{ placeholder }}</div>
    <ng-content select="nc-pseudo-caret"></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-pseudo-input',
    '[class.disabled]': 'disabled',
    '[tabindex]': 'tabIndex',
  },
})
export class NcPseudoInput implements OnInit {
  tabIndex: number;

  private _value: string | undefined;

  @Input()
  get value(): string | undefined {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
  }

  private _placeholder: string | undefined;

  @Input()
  get placeholder(): string | undefined {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
  }

  private _disabled = false;

  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  get disabled() {
    return this._disabled;
  }

  constructor(
    private _elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
  ) {
    this.tabIndex = parseInt(tabIndex) || 0;
  }

  ngOnInit() {}
}
