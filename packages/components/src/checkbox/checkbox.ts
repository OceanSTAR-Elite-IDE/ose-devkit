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
import { ControlValueAccessor, NgControl } from '@angular/forms';

let uniqueId = 0;

export class NcCheckboxChange {
  constructor(
    public source: NcCheckbox,
    public checked: boolean,
  ) {}
}

@Component({
  selector: 'nc-checkbox',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'checkbox.html',
  host: {
    class: 'nc-checkbox',
  },
})
export class NcCheckbox implements ControlValueAccessor {
  readonly id: string = `nc-checkbox-${uniqueId++}`;

  tabIndex: number;

  private _value: any | null;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: any | null) {
    this._value = value;
  }

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
    if (value !== this.checked) {
      this._checked = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _indeterminated: boolean = false;

  @Input()
  get indeterminated(): boolean {
    return this._indeterminated;
  }
  set indeterminated(value: BooleanInput) {
    value = coerceBooleanProperty(value);
    const changed = value !== this._indeterminated;
    this._indeterminated = value;

    if (changed) {
      this.indeterminateChange.emit(this._indeterminated);
    }
  }

  @Output() readonly change = new EventEmitter<NcCheckboxChange>();

  // TODO: 考虑合并到 change 事件中
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  writeValue(value: any) {
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
    const event = new NcCheckboxChange(this, this.checked);
    this._onChange(this.checked);
    this.change.emit(event);
  }
}
