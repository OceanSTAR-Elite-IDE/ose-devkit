import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NcFormFieldControl } from '@oceanstar/components/forms';

import './input.css';

@Directive({
  selector: 'input[ncInput], textarea[ncInput]',
  host: {
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(change)': '_changed($event)',
    class: 'nc-input',
    '[disabled]': 'disabled',
    '[attr.readonly]': 'readonly || null',
  },
  providers: [{ provide: NcFormFieldControl, useExisting: NcInput }],
})
export class NcInput implements NcFormFieldControl<any> {
  _focused = false;

  @Input() placeholder = '';

  private _disabled = false;

  @Output() valueChange = new EventEmitter<any>();

  @Input()
  get disabled(): boolean {
    // return this.ngControl?.disabled || this._disabled;
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    if (this._focused) {
      this._focused = false;
    }
  }

  private _required = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  private _type = 'text';

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      this._elementRef.nativeElement.type = this._type;
    }
  }

  @Input()
  get value(): any {
    return this._elementRef.nativeElement.value;
  }
  set value(value: any) {
    if (value !== this.value) {
      this._elementRef.nativeElement.value = value;
    }
  }

  private _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }

  get empty(): boolean {
    return !this._elementRef.nativeElement.value && !this._isBadInput();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private _platform: Platform,
    private _elementRef: ElementRef,
  ) {}

  focus() {
    this._elementRef.nativeElement.focus();
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this._focused && !this.readonly) {
      this._focused = isFocused;
    }
  }

  _changed(event: Event) {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  protected _isBadInput() {
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  /** Determines if the component host is a textarea. If not recognizable it returns false. */
  private _isTextarea() {
    const nativeElement = this._elementRef.nativeElement;
    const nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
    return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
  }
}
