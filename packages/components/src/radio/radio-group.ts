import { defer, merge, Observable } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  inject,
  Input,
  isDevMode,
  NgZone,
  Optional,
  Output,
  QueryList,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NcFormFieldControl } from '@oceanstar/components/forms';

import { NcRadioChange, NcRadio } from './radio';

export function getNtRdioGroupNonFunctionValueError() {
  return Error('`compareWith` must be a function.');
}

let uniqueId = 0;

@Component({
  selector: 'nc-radio-group',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NcFormFieldControl, useExisting: NcRadioGroup }],
  host: {
    class: 'nc-radio-group',
  },
})
export class NcRadioGroup<T> implements ControlValueAccessor, AfterViewInit, NcFormFieldControl<T> {
  readonly id: string = `nc-radio-group-${uniqueId++}`;

  private _destroyRef = inject(DestroyRef);

  private _value: T | null | undefined;
  private _disabled = false;
  private _readonly = false;
  private _required = false;

  private _name: string = this.id;

  get value() {
    return this._value;
  }

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  get disabled() {
    return this._disabled;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }
  get readonly() {
    return this._readonly;
  }

  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  @ContentChildren(NcRadio) radios!: QueryList<NcRadio<T>>;

  private _compareWith = (o1: any, o2: any) => o1 === o2;

  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw getNtRdioGroupNonFunctionValueError();
    } else {
      this._compareWith = fn;
    }
  }

  @Output() readonly checkedChanges: Observable<NcRadioChange<T>> = defer(() => {
    const radios = this.radios;

    if (radios) {
      return radios.changes.pipe(
        startWith(radios),
        switchMap(() => merge(...radios.map(item => item.change))),
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.checkedChanges),
    );
  });

  /** Emits when the value changes (either due to user input or programmatic change). */
  private _onChange: (value: any) => void = () => {};
  private _onTouched = () => {};

  constructor(
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    @Self() @Optional() public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
    this.radios.changes.pipe(startWith(null), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._resetRadios();
      this._initializeChecked();
    });
  }

  writeValue(value: T) {
    if (this.radios) {
      this._setCheckedByValue(value);
    }
  }

  registerOnChange(fn: (_: any) => {}) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  focus() {
    if (!this.disabled) {
      this._onTouched();
    }
  }

  private _initializeChecked(): void {
    Promise.resolve().then(() => {
      this._updateRadioButtonNames();
      this._setCheckedByValue(this.ngControl ? this.ngControl.value : this.value);
    });
  }

  private _resetRadios() {
    const changedOrDestroyed = this.radios.changes;

    this.checkedChanges.pipe(takeUntilDestroyed(this._destroyRef), takeUntil(changedOrDestroyed)).subscribe(change => {
      this._setValues(change.source);
    });

    merge(...this.radios.map(item => item.change))
      .pipe(takeUntilDestroyed(this._destroyRef), takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  private _setCheckedByValue(value: T) {
    this._value = value;
    this.radios.forEach(item => (item.checked = false));
    this._checkedValue(value);
    this._changeDetectorRef.markForCheck();
  }

  private _checkedValue(value: any): NcRadio<T> | undefined {
    const correspondingItem = this.radios.find((item: NcRadio<T>) => {
      try {
        return item.value != null && this._compareWith(item.value, value);
      } catch (error) {
        if (isDevMode()) {
          console.warn(error);
        }
        return false;
      }
    });
    if (correspondingItem) {
      correspondingItem.checked = true;
    }
    return correspondingItem;
  }

  private _setValues(radio: NcRadio<T>): void {
    this._value = radio.value;
    this._onChange(this._value);
    this._onTouched();
    this._changeDetectorRef.markForCheck();
  }

  private _updateRadioButtonNames(): void {
    if (this.radios) {
      this.radios.forEach(radio => {
        radio.name = this.name;
      });
    }
  }
}
