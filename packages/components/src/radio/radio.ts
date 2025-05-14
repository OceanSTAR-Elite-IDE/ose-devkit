import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, Component, EventEmitter, Input, Optional, Output, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let uniqueId = 0;

export class NcRadioChange<T> {
  constructor(
    public source: NcRadio<T>,
    public selected: boolean,
  ) {}
}

@Component({
  selector: 'nc-radio',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'radio.html',
  host: {
    class: 'nc-radio',
  },
})
export class NcRadio<T> implements ControlValueAccessor {
  readonly id: string = `nc-radio-${uniqueId++}`;

  private _name: string = this.id;

  tabIndex: number;

  private _value!: T | null;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: T | null) {
    this._value = value;
  }

  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _readonly = false;

  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }

  private _checked = false;

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: BooleanInput) {
    this._checked = coerceBooleanProperty(value);
  }

  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  @Output() readonly change = new EventEmitter<NcRadioChange<T>>();

  private _onChange: (value: any) => void = () => {};
  private _onTouched = () => {};

  constructor(
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
  }

  _onInputChange(event: Event) {
    event.stopPropagation();
    this._checked = true;
    this._emitChangeEvent();
  }

  private _emitChangeEvent() {
    const event = new NcRadioChange(this, this.checked);
    this._onChange(this.checked);
    this._onTouched();
    this.change.emit(event);
  }
}
