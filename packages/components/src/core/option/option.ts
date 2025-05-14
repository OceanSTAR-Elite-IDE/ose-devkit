import { Subject } from 'rxjs';

import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export interface NcOptionParent {
  disabled?: boolean;
  multiple?: boolean;
}

export class NcOptionSelectionChange {
  constructor(
    public source: NcOption,
    public isUserInput = false,
  ) {}
}

export const NC_OPTION_PARENT = new InjectionToken<NcOptionParent>('nc-option-parent');

@Component({
  selector: 'nc-option',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-option',
    '[class.nc-option-selected]': 'selected',
    '[class.nc-option-disabled]': 'disabled',
    '[class.nc-option-active]': '_isActive',
    '[class.nc-option-hidden]': 'hidden',
    '(click)': 'selectViaInteraction()',
  },
})
export class NcOption implements AfterViewChecked, Highlightable, ListKeyManagerOption {
  private _value: any;
  private _selected = false;
  private _disabled = false;
  private _label = '';
  private _hidden = false;

  private _mostRecentViewValue = '';

  _isActive = false;

  @Input()
  set label(value: string) {
    this._label = value;
  }
  get label() {
    if (!this._label.trim()) {
      return (this._element.nativeElement.textContent || '').trim();
    }
    return this._label.trim();
  }

  get multiple() {
    return this._parent && this._parent.multiple;
  }

  @Input()
  set value(value: any) {
    this._value = value;
  }
  get value() {
    return this._value;
  }

  @Input()
  get disabled() {
    return this._disabled || this.hidden;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  set hidden(value: boolean) {
    this._hidden = coerceBooleanProperty(value);
  }
  get hidden() {
    return this._hidden;
  }

  get selected() {
    return this._selected;
  }

  readonly stateChanges = new Subject<void>();

  @Output() readonly selectionChange = new EventEmitter<NcOptionSelectionChange>();

  constructor(
    private _element: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(NC_OPTION_PARENT) private _parent: NcOptionParent,
  ) {}

  ngAfterViewChecked() {
    if (this._selected) {
      const viewValue = this.label;
      if (viewValue !== this._mostRecentViewValue) {
        this._mostRecentViewValue = viewValue;
        this.stateChanges.next();
      }
    }
  }

  focus() {
    const element = this._element.nativeElement;
    if (typeof element.focus === 'function') {
      element.focus();
    }
  }

  select() {
    this._selected = true;
    this._changeDetectorRef.markForCheck();
    this._emitSelectionChangeEvent();
  }

  deselect() {
    this._selected = false;
    this._changeDetectorRef.markForCheck();
    this._emitSelectionChangeEvent();
  }

  selectViaInteraction() {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this._emitSelectionChangeEvent(true);
    }
  }

  setActiveStyles() {
    this._isActive = true;
  }

  setInactiveStyles() {
    this._isActive = false;
  }

  getLabel() {
    return this.label;
  }

  getOffsetTop() {
    return this._element.nativeElement.offsetTop;
  }

  getOffsetHeight() {
    return this._element.nativeElement.offsetHeight;
  }

  protected _emitSelectionChangeEvent(isUserInput = false): void {
    this.selectionChange.emit(new NcOptionSelectionChange(this, isUserInput));
  }
}
