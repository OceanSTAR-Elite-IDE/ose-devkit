import { defer, Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  inject,
  Input,
  NgZone,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, NgControl, NgForm, ValidationErrors } from '@angular/forms';
import { fadeIn, fadeOut } from '@oceanstar/components/core';

import { NcFormErrorPipe } from './form-error.pipe';
import { NcFormFieldControl } from './form-field-control';
import { NcFormLabelWidth } from './form-label-width';
import { NcFormOrientationType, NcFormOrientation } from './form-orientation';

@Component({
  imports: [CommonModule, NcFormErrorPipe],
  selector: 'nc-form-field',
  template: `
    <label *ngIf="labelVisible" class="nc-form-label" [class.required]="markVisible && required" [ngStyle]="_labelStyles">
      {{ label }}<sup *ngIf="sublabel" class="nc-form-sublabel">{{ sublabel }}</sup>
    </label>
    <div class="nc-form-group" [ngStyle]="_groupStyles">
      <ng-content></ng-content>
      <p *ngIf="_invalid && errors && errorVisible" class="nc-form-message" [@fade]="_invalid">
        {{ errors | formError: label : messages }}
      </p>
    </div>
  `,
  animations: [trigger('fade', [transition('* => false', fadeOut(0.15)), transition('* => true', fadeIn(0.15))])],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-form-field',
    '[class.nc-form-error]': '_invalid',
    '[class.nc-form-horizontal]': 'isHorizontal()',
  },
})
export class NcFormField implements AfterContentInit {
  private _destroyRef = inject(DestroyRef);

  private _markVisible = true;

  private _isDefaultWidthValue = true;

  private _ngForm: NgForm | FormGroupDirective | null = null;

  /** 表单宽度 （只在 horizontal 模式下起作用） */
  _labelStyles: any = {};

  _groupStyles: any = {};

  _invalid = false;

  @Input() label!: string;

  @Input() sublabel!: string;

  /** 表单可见性 */
  private _labelVisible = true;

  @Input()
  get labelVisible() {
    return this._labelVisible;
  }
  set labelVisible(value: BooleanInput) {
    this._labelVisible = coerceBooleanProperty(value);
  }

  /** 错误可见性 */
  private _errorVisible = true;

  @Input()
  get errorVisible() {
    return this._errorVisible;
  }
  set errorVisible(value: BooleanInput) {
    this._errorVisible = coerceBooleanProperty(value);
  }

  private _labelWidth = 120;

  @Input()
  get labelWidth() {
    return this._labelWidth;
  }
  set labelWidth(value: number) {
    const coercedValue = coerceNumberProperty(value, 0);
    if (coercedValue > 0) {
      this._isDefaultWidthValue = false;
      this._labelWidth = coercedValue;
    } else {
      this._isDefaultWidthValue = true;
      this._labelWidth = 120;
    }
    this._setHorizontalStyles();
  }

  @Input() messages!: { [key: string]: string };

  private _orientation: NcFormOrientationType = 'vertical';

  @Input()
  get orientation() {
    return this._orientation;
  }
  set orientation(value: NcFormOrientationType) {
    this._orientation = value;
    this._setHorizontalStyles();
  }

  @Input()
  get markVisible() {
    return this._markVisible;
  }
  set markVisible(value: BooleanInput) {
    this._markVisible = coerceBooleanProperty(value);
  }

  get required() {
    if (this.ngControl?.control?.validator) {
      const control = new FormControl();
      const validateResult = this.ngControl.control.validator(control);
      return validateResult && validateResult.hasOwnProperty('required');
    }

    if (this.control) {
      return !!this.control.required;
    }

    return false;
  }

  get errors(): ValidationErrors | null {
    if (typeof this.control.getErrors === 'function') {
      return this.control.getErrors();
    }
    return this.control.ngControl?.errors || null;
  }

  // 表单模型
  // TODO: 支持多表单控件
  @ContentChild(NcFormFieldControl) control!: NcFormFieldControl<any>;

  get ngControl(): NgControl | null {
    return this.control?.ngControl || null;
  }

  readonly statusChanges: Observable<any> = defer(() => {
    if (this.control && this.ngControl) {
      return this.ngControl.statusChanges ? this.ngControl.statusChanges : of(null);
    }
    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.statusChanges),
    );
  });

  constructor(
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Optional() private _formLabelWidth: NcFormLabelWidth,
    @Optional() private _formOrientation: NcFormOrientation,
  ) {
    this._ngForm = parentForm || parentFormGroup;

    if (this._formLabelWidth) {
      this._subscribeContainerWidthChange();
    }

    if (this._formOrientation) {
      this._subscribeContainerOrientationChange();
    }

    this.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => this._validate());
  }

  ngAfterContentInit() {
    if (this._ngForm && this.ngControl) {
      this._ngForm.ngSubmit.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._validate());
    }
  }

  _clearValidateMessage() {
    this._invalid = false;
  }

  isHorizontal() {
    return this.orientation === 'horizontal';
  }

  isVertical() {
    return this.orientation === 'vertical';
  }

  private _validate() {
    if (this.ngControl) {
      this._invalid = !!this.ngControl.invalid;
      this._changeDetectorRef.markForCheck();
    }
  }

  private _subscribeContainerWidthChange() {
    this._formLabelWidth.widthChange
      .pipe(
        filter(() => this._isDefaultWidthValue),
        takeUntilDestroyed(),
      )
      .subscribe(width => {
        this._labelWidth = width;
        this._setHorizontalStyles();
      });
  }

  private _subscribeContainerOrientationChange() {
    this._formOrientation.typeChange
      .pipe(
        // filter(() => !this._orientation),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(orientation => {
        this._orientation = orientation;
        this._setHorizontalStyles();
      });
  }

  private _setHorizontalStyles() {
    if (this.labelWidth > 0 && this.isHorizontal()) {
      this._labelStyles['width.px'] = this.labelWidth;
      // this._groupStyles['margin-left.px'] = this.labelWidth;
    } else {
      delete this._labelStyles['width.px'];
      // delete this._groupStyles['margin-left.px'];
    }
  }
}
