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

import { NcCheckbox, NcCheckboxChange } from './checkbox';

export function getNcCheckboxGroupNonFunctionValueError() {
  return Error('`compareWith` must be a function.');
}

let uniqueId = 0;

@Component({
  selector: 'nc-checkbox-group',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .nc-checkbox-group {
      display: block;
    }
  `,
  providers: [{ provide: NcFormFieldControl, useExisting: NcCheckboxGroup }],
  host: {
    class: 'nc-checkbox-group',
  },
})
export class NcCheckboxGroup<T> implements ControlValueAccessor, AfterViewInit, NcFormFieldControl<T[]> {
  private _destroyRef = inject(DestroyRef);

  readonly id: string = `nc-checkbox-group-${uniqueId++}`;

  private _value!: T[];
  private _disabled = false;
  private _readonly = false;
  private _required = false;

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

  @ContentChildren(NcCheckbox) checkboxes!: QueryList<NcCheckbox>;

  private _compareWith = (o1: any, o2: any) => o1 === o2;

  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw getNcCheckboxGroupNonFunctionValueError();
    } else {
      this._compareWith = fn;
    }
  }

  @Output() readonly checkedChanges: Observable<NcCheckboxChange> = defer(() => {
    const checkboxes = this.checkboxes;

    if (checkboxes) {
      return checkboxes.changes.pipe(
        startWith(checkboxes),
        switchMap(() => merge(...checkboxes.map(item => item.change))),
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
    this.checkboxes.changes.pipe(startWith(null), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._resetCheckboxs();
      this._initializeChecked();
    });
  }

  writeValue(value: T[]) {
    if (this.checkboxes) {
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
      this._setCheckedByValue(this.ngControl ? this.ngControl.value : this.value);
    });
  }

  private _resetCheckboxs() {
    const changedOrDestroyed = this.checkboxes.changes;

    this.checkedChanges
      .pipe(takeUntilDestroyed(this._destroyRef), takeUntil(changedOrDestroyed))
      .subscribe(() => this._setValues());

    merge(...this.checkboxes.map(item => item.change))
      .pipe(takeUntilDestroyed(this._destroyRef), takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  private _setCheckedByValue(value: T[]) {
    if (value) {
      this._value = value;
      this.checkboxes.forEach(item => (item.checked = false));
      value.forEach(val => this._checkedValue(val));
      this._changeDetectorRef.markForCheck();
    }
  }

  private _checkedValue(value: any): NcCheckbox | undefined {
    const correspondingItem = this.checkboxes.find((item: NcCheckbox) => {
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

  private _setValues(): void {
    this._value = [];
    this.checkboxes.forEach(item => {
      if (item.checked && !!item.value) {
        this._value.push(item.value);
      }
    });
    this._onChange(this._value);
    this._onTouched();
    this._changeDetectorRef.markForCheck();
  }
}
