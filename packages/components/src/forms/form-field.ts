import { defer, Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  Inject,
  inject,
  Input,
  NgZone,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroupDirective, NgControl, NgForm, ValidationErrors, Validators } from '@angular/forms';

import { NcFormErrorPipe } from './form-error.pipe';
import { NcFormFieldControl } from './form-field-control';
import { DEFAULT_FORM_FIELD_ICONS, NC_FORM_FIELD_ICONS, NcFormFieldIcons } from './form-field-icons';
import { NcFormLabelWidth } from './form-label-width';
import { NcFormOrientation, NcFormOrientationType } from './form-orientation';

@Component({
  imports: [CommonModule, NcFormErrorPipe],
  selector: 'nc-form-field',
  exportAs: 'ncFormField',
  template: `
    <label *ngIf="labelVisible" class="nc-form-label" [class.required]="markVisible && required" [ngStyle]="_labelStyles">
      {{ label }}<span *ngIf="sublabel" class="nc-form-sublabel">{{ sublabel }}</span>
    </label>
    <div class="nc-form-group" [ngStyle]="_groupStyles">
      <ng-content></ng-content>

      <p *ngIf="messageVisible" class="nc-form-helptext">
        @if (isInvalidState && errors) {
          <span [class]="icons.error"></span>
          {{ errors | formError: label : messages }}
        } @else if (isSuccessState) {
          <span [class]="icons.success"></span>
          {{ helptext || 'Good' }}
        } @else if (helptext) {
          <span [class]="icons.info"></span>
          {{ helptext }}
        }
      </p>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nc-form-field',
    '[class.nc-form-error]': 'isInvalidState',
    '[class.nc-form-success]': 'isSuccessState',
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

  isInvalidState = false;

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

  /** 表单可见性 */
  private _messageVisible = true;

  @Input()
  get messageVisible() {
    return this._messageVisible;
  }
  set messageVisible(value: BooleanInput) {
    this._messageVisible = coerceBooleanProperty(value);
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

  private _helptext!: string;

  @Input()
  get helptext() {
    return this._helptext;
  }
  set helptext(value: string) {
    this._helptext = value;
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

  get isSuccessState() {
    if (!this.ngControl || !this.ngControl.control) return false;

    const control = this.ngControl.control;
    const hasRequiredValidator = control.hasValidator(Validators.required);
    const hasAnyValidator = !!control.validator;

    // 情况1: 有 required 验证器
    if (hasRequiredValidator) {
      return this.ngControl.touched && this.ngControl.valid;
    }

    // 情况2: 没有任何验证器
    if (!hasAnyValidator) {
      return false;
    }

    // 情况3: 没有 required 验证器，但有其他验证器
    if (hasAnyValidator && !hasRequiredValidator) {
      // 没有值时返回 false
      if (!this.ngControl.value) {
        return false;
      }
      // 有值时根据 touched 和 valid 判断
      return this.ngControl.touched && this.ngControl.valid;
    }

    return false;
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
    @Optional() @Inject(NC_FORM_FIELD_ICONS) public icons: NcFormFieldIcons,
  ) {
    this._ngForm = parentForm || parentFormGroup;

    this.icons = { ...DEFAULT_FORM_FIELD_ICONS, ...icons };

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
    this.isInvalidState = false;
  }

  isHorizontal() {
    return this.orientation === 'horizontal';
  }

  isVertical() {
    return this.orientation === 'vertical';
  }

  private _validate() {
    if (this.ngControl) {
      this.isInvalidState = !!this.ngControl.invalid;
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
