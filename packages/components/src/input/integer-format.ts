import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

export function reverseFormatNumber(val: any, locale: string) {
  const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');

  let reversedCurrencyVal = val.replace(new RegExp('\\' + group, 'g'), '');
  reversedCurrencyVal = reversedCurrencyVal.replace(new RegExp('\\' + decimal, 'g'), '.');
  let reversedVal = reversedCurrencyVal.replace(/[^\d.-]/g, '');
  return Number.isNaN(reversedVal) ? 0 : reversedVal;
}

@Directive({
  selector: 'input[ncIntegalFormat]',
  host: {
    '(focus)': 'onFocus()',
    '(keydown)': 'onKeyDown($event)',
    '(blur)': 'onBlur()',
    '(paste)': 'onPaste($event)',
  },
})
export class NcIntegerFormat implements AfterViewInit {
  private _specialKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Del', 'Tab'];

  private _regex = {
    positiveIntegal: new RegExp(/^\d*$/g),
    allIntegal: new RegExp(/^-?\d*$/g),
  };

  private _min: number | undefined;

  @Input()
  get min() {
    return this._min;
  }
  set min(value: string | number | undefined) {
    this._min = coerceNumberProperty(value);
  }

  private _max: number | undefined;

  @Input()
  get max() {
    return this._max;
  }
  set max(value: string | number | undefined) {
    this._max = coerceNumberProperty(value);
  }

  private _allowNegative = false;

  @Input()
  get allowNegative() {
    return this._allowNegative;
  }
  set allowNegative(value: boolean) {
    this._allowNegative = coerceBooleanProperty(value);
  }

  private _input: HTMLInputElement;

  constructor(private el: ElementRef) {
    this._input = this.el.nativeElement;
  }

  ngAfterViewInit() {
    if (this._input.value) {
      this._input.value = this._transformValue(this._input.value);
    }
  }

  onFocus() {
    this._input.select();
  }

  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text') || '';
    const matches = this.allowNegative ? text.match(this._regex.allIntegal) : text.match(this._regex.positiveIntegal);
    if (!matches) {
      event.preventDefault();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this._isCombinationKey(event)) {
    } else if (this._specialKeys.indexOf(event.key) > -1) {
      return;
    } else {
      const matches = this.allowNegative
        ? event.key.match(this._regex.allIntegal)
        : event.key.match(this._regex.positiveIntegal);
      if (!matches) {
        event.preventDefault();
      }
    }
  }

  onBlur() {
    let value = this._transformValue(this._input.value);
    let valueNumber = Number(value);
    if (this._min !== undefined) {
      value = `${Math.max(this._min, valueNumber)}`;
    }

    if (this._max !== undefined) {
      value = `${Math.min(this._max, valueNumber)}`;
    }

    this._input.value = value;
  }

  private _transformValue(value: any) {
    return `${Math.ceil(value)}`;
  }

  private _isCombinationKey(event: KeyboardEvent) {
    return event.key === 'v' && event.ctrlKey;
  }
}
