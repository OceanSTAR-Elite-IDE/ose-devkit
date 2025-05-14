import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

let uniqueId = 0;

export class NcSwitchChange<T> {
  constructor(
    public source: NcSwitch<T>,
    public checked: boolean,
  ) {}
}

@Component({
  selector: 'nc-switch',
  templateUrl: 'switch.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-switch',
    '[class.nt-switch-checked]': 'checked',
    '[class.nt-switch-disabled]': 'disabled',
    '[class.nt-switch-circle]': 'circle',
  },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: NcSwitch, multi: true }],
})
export class NcSwitch<T> implements ControlValueAccessor {
  readonly id: string = `nc-switch-${uniqueId++}`;

  tabIndex: number;

  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    if (value !== this.disabled) {
      this._disabled = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _checked = false;

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: BooleanInput) {
    if (value !== this.checked) {
      this._checked = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _circle = false;

  @Input()
  get circle(): boolean {
    return this._circle;
  }
  set circle(value: BooleanInput) {
    if (value !== this.circle) {
      this._circle = coerceBooleanProperty(value);
    }
  }

  @Output() readonly change = new EventEmitter<NcSwitchChange<T>>();

  private _onChange: (value: any) => void = () => {};
  private _onTouched = () => {};

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex: string,
    @Self() @Optional() public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex) || 0;
  }

  writeValue(value: T) {
    this._checked = !!value;
  }

  registerOnChange(fn: (_: any) => {}) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  _onInputClick(event: Event) {
    event.stopPropagation();
    if (!this.disabled) {
      this._checked = !this._checked;
      this._onTouched();
      this._emitChangeEvent();
    }
  }

  _onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  private _emitChangeEvent() {
    const event = new NcSwitchChange(this, this.checked);
    this._onChange(this.checked);
    this.change.emit(event);
  }
}
