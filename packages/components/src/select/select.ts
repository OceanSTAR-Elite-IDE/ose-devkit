import { defer, merge, Observable } from 'rxjs';
import { filter, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { transition, trigger } from '@angular/animations';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, RIGHT_ARROW, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  isDevMode,
  NgZone,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { fadeIn, fadeOut, NC_OPTION_PARENT, NcOption, NcOptionParent, NcOptionSelectionChange, NcPseudoInputModule } from '@oceanstar/components/core';
import { NcFormFieldControl } from '@oceanstar/components/forms';
import { BOTTOM_LEFT, NcOverlay, NcOverlayModule, TOP_LEFT } from '@oceanstar/components/overlay';

import { DEFAULT_SELECT_ICONS, NC_SELECT_ICONS, NcSelectIcons } from './select-icons';

export function getNcSelectDynamicMultipleError() {
  return Error('Cannot change `multiple` mode of select after initialization.');
}

export function getNcSelectNonArrayValueError() {
  return Error('Value must be an array in multiple-selection mode.');
}

export function getNcSelectNonFunctionValueError() {
  return Error('`compareWith` must be a function.');
}

export class NcSelectChange {
  constructor(
    public source: NcSelect,
    public value: any,
  ) {}
}

@Component({
  imports: [CommonModule, NcOverlayModule, NcPseudoInputModule],
  selector: 'nc-select',
  templateUrl: 'select.html',
  providers: [
    { provide: NC_OPTION_PARENT, useExisting: NcSelect },
    { provide: NcFormFieldControl, useExisting: NcSelect },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fade', [transition('* => void', fadeOut(0.15)), transition('void => *', fadeIn(0.15))])],
  host: {
    class: 'nc-select',
    '(window:resize)': 'onResize()',
  },
})
export class NcSelect implements AfterContentInit, ControlValueAccessor, NcOptionParent, NcFormFieldControl<any> {
  private _destroyRef = inject(DestroyRef);

  readonly origin: CdkOverlayOrigin;

  private _selectionModel!: SelectionModel<NcOption>;

  _positionPairs: ConnectionPositionPair[] = [BOTTOM_LEFT, TOP_LEFT];

  tabIndex: number;

  private _compareWith = (o1: any, o2: any) => o1 === o2;
  private _onChange: (value: any) => void = () => {};
  private _onTouched = () => {};

  private _value: any;

  get value() {
    return this._value;
  }
  get displayValue(): string {
    if (this.empty) {
      return '';
    }

    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map(option => option.label);
      return selectedOptions.join(', ');
    }

    return this._selectionModel.selected[0].label;
  }

  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  get optionEmpty(): boolean {
    return this.options ? this.options.filter(option => !option.hidden).length === 0 : false;
  }

  private _focused = false;

  get focused(): boolean {
    return this._focused;
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _required = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  private _state = '';

  get state() {
    return this._state;
  }

  private _width!: number;

  get width() {
    return this._width;
  }

  private _clearable = false;

  @Input()
  get clearable() {
    return this._clearable;
  }
  set clearable(value: BooleanInput) {
    this._clearable = coerceBooleanProperty(value);
  }

  private _multiple = false;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: BooleanInput) {
    this._multiple = coerceBooleanProperty(value);
  }

  private _filter!: (keyword: string, option: NcOption) => boolean;

  @Input()
  get filter() {
    return this._filter;
  }
  set filter(value: (input: string, option: NcOption) => boolean) {
    if (typeof value === 'function') {
      this._filter = value;
    } else if (coerceBooleanProperty(value)) {
      this._filter = (keyword: string, option: NcOption) => {
        const regex = new RegExp(keyword.toLowerCase(), 'g');
        return regex.test(option.label.toLowerCase());
      };
    }
  }

  @Input() filterNotFound = 'Not Found';

  get selected(): NcOption | NcOption[] {
    return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
  }

  get hasSelectedValue() {
    return this._selectionModel.selected.length > 0;
  }

  private _placeholder = '';

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }
  get placeholder() {
    if (this.empty) {
      return this._placeholder;
    }

    return typeof this.filter === 'function' ? this.displayValue : this._placeholder;
  }

  _keyManager!: ActiveDescendantKeyManager<NcOption>;

  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  @ViewChild('paneElement', { static: true }) paneElement!: ElementRef;

  @ViewChild(NcOverlay, { static: true }) overlay!: NcOverlay;
  @ContentChildren(NcOption) options!: QueryList<NcOption>;

  @Output() afterOpen = new EventEmitter<any>();
  @Output() afterClosed = new EventEmitter<any>();

  @Output() beforeOpen = new EventEmitter<any>();
  @Output() beforeClosed = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @Output() readonly selectionChange: EventEmitter<NcSelectChange> = new EventEmitter<NcSelectChange>();

  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw getNcSelectNonFunctionValueError();
    } else {
      this._compareWith = fn;
      if (this._selectionModel) {
        this._initializeSelection();
      }
    }
  }

  readonly optionSelectionChanges: Observable<NcOptionSelectionChange> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map(item => item.selectionChange))),
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.optionSelectionChanges),
    );
  });

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() @Inject(NC_SELECT_ICONS) public icons: NcSelectIcons,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.origin = new CdkOverlayOrigin(this._elementRef);
    this.icons = { ...DEFAULT_SELECT_ICONS, ...icons };

    this.tabIndex = parseInt(tabIndex) || 0;
  }

  ngOnInit() {
    this._selectionModel = new SelectionModel(this.multiple, undefined, false);
  }

  ngAfterContentInit() {
    this._initKeyManager();
    this.options.changes.pipe(startWith(null), takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }

  onResize() {
    this._width = this._elementRef.nativeElement.clientWidth;
  }

  _onSearch(event: KeyboardEvent) {
    if (this.overlay.opened && this.filter && !this.disabled) {
      const target: any = event.target;
      this.options.forEach(option => (option.hidden = !this.filter(target.value, option)));
    }
  }

  _beforeOpen(event: any) {
    this._state = 'folded';
    this.onResize();
    this._scrollActiveOptionIntoView();
    this._highlightCorrectOption();
    this.beforeOpen.next(event);
  }

  _beforeClosed(event: any) {
    this._state = 'closed';
    this._onTouched();
    this.beforeClosed.next(event);
  }

  _afterOpen(event: any) {
    this.afterOpen.next(event);
  }

  _afterClosed(event: any) {
    this._resetFilterResult();
    this.afterClosed.next(event);
  }

  _positionChange(change: ConnectedOverlayPositionChange) {
    this.positionChange.next(change);
  }

  _onInputClick(event: Event) {
    if (!this.disabled) {
      this.overlay.toggle();
    }
    event.stopPropagation();
  }

  _onInputFocus() {
    this._focused = true;
    this.overlay.markOpen();
  }

  _onInputBlur() {
    this._focused = false;
  }

  _onClear(event: Event) {
    if (this.value !== null && !this.disabled) {
      // this._setSelectionByValue(null, true);
      this._clearSelection();
      this._value = null;
      this.valueChange.emit(null);
      this._onChange(null);
      this.selectionChange.emit(new NcSelectChange(this, null));
      this._changeDetectorRef.markForCheck();
    }

    event.stopPropagation();
  }

  focus() {
    if (!this.disabled) {
      if (typeof this.filter === 'function') {
        this.inputElement.nativeElement.focus();
      } else {
        this.overlay.open();
      }
    }
  }

  writeValue(value: any) {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  registerOnChange(fn: (_: any) => {}) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled = isDisabled;
  }

  /** Handles all keydown events on the select. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.overlay.opened ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const manager = this._keyManager;
    if (keyCode === HOME || keyCode === END) {
      event.preventDefault();
      keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      event.preventDefault();
      this.overlay.close();
    } else if ((keyCode === ENTER || keyCode === SPACE) && manager.activeItem) {
      event.preventDefault();
      manager.activeItem.selectViaInteraction();
      if (keyCode === ENTER && this.multiple) {
        this.overlay.close();
      }
    } else if (keyCode === TAB) {
      this.overlay.close();
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;
      manager.onKeydown(event);

      if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem && manager.activeItemIndex !== previouslyFocusedIndex) {
        manager.activeItem.selectViaInteraction();
      }
    }
  }

  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.code || event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;

    // Open the select on ALT + arrow key to match the native <select>
    if (isOpenKey || ((this.multiple || event.altKey) && isArrowKey)) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.overlay.open();
    } else if (!this.multiple) {
      this._keyManager.onKeydown(event);
    }
  }

  private _resetOptions() {
    const changedOrDestroyed = this.options.changes;

    this.optionSelectionChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        takeUntil(changedOrDestroyed),
        filter(event => event.isUserInput),
      )
      .subscribe(event => {
        this._onSelect(event.source);
        if (!this.multiple && this.overlay.opened) {
          this.overlay.close();
        }
      });

    // Listen to changes in the internal state of the options and react accordingly.
    // Handles cases like the labels of the selected options changing.
    merge(...this.options.map(option => option.stateChanges))
      .pipe(takeUntilDestroyed(this._destroyRef), takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });

    this._resetFilterResult();
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<NcOption>(this.options).withTypeAhead().withVerticalOrientation();

    this._keyManager.tabOut.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      // Restore focus to the trigger before closing. Ensures that the focus
      // position won't be lost if the user got focus into the overlay.
      this.focus();
      this.overlay.close();
      // this.inputElement.nativeElement.blur();
    });

    this._keyManager.change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      if (this.overlay.opened && this.paneElement) {
        this._scrollActiveOptionIntoView();
      } else if (!this.overlay.opened && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem.selectViaInteraction();
      }
    });
  }

  private _resetFilterResult() {
    this.options.forEach(option => (option.hidden = false));
  }

  private _initializeSelection(): void {
    Promise.resolve().then(() => {
      this._setSelectionByValue(this.ngControl ? this.ngControl.value : this.value);
    });
  }

  private _setSelectionByValue(value: any | any[], isUserInput = false): void {
    if (this.multiple && value) {
      if (!Array.isArray(value)) {
        throw getNcSelectNonArrayValueError();
      }

      this._clearSelection();
      value.forEach((currentValue: any) => this._selectValue(currentValue, isUserInput));
      this._sortValues();
    } else {
      this._clearSelection();

      const correspondingOption = this._selectValue(value, isUserInput);
      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what option the user interacted with last.
      if (correspondingOption) {
        this._keyManager.setActiveItem(this.options.toArray().indexOf(correspondingOption));
      }
    }

    this._changeDetectorRef.markForCheck();
  }

  private _selectValue(value: any, isUserInput = false): NcOption | undefined {
    const correspondingOption = this.options.find((option: NcOption) => {
      try {
        return option.value !== null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      isUserInput ? correspondingOption.selectViaInteraction() : correspondingOption.select();
      this._selectionModel.select(correspondingOption);
      // this._value = correspondingOption.value;
    }

    return correspondingOption;
  }

  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    if (this.multiple) {
      valueToEmit = (this.selected as NcOption[]).map(option => option.value);
    } else {
      valueToEmit = this.selected ? (this.selected as NcOption).value : fallbackValue;
    }

    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit(new NcSelectChange(this, valueToEmit));
    this._changeDetectorRef.markForCheck();
  }

  private _clearSelection(skip?: NcOption) {
    this._selectionModel.clear();
    this.options.forEach(option => {
      if (option !== skip) {
        option.deselect();
      }
    });
  }

  private _sortValues(): void {
    if (this.multiple) {
      this._selectionModel.clear();

      this.options.forEach(option => {
        if (option.selected) {
          this._selectionModel.select(option);
        }
      });
    }
  }

  private _onSelect(option: NcOption) {
    const wasSelected = this._selectionModel.isSelected(option);

    if (this.multiple) {
      this._selectionModel.toggle(option);
      wasSelected ? option.deselect() : option.select();
      this._keyManager.setActiveItem(this.options.toArray().indexOf(option));
      this._sortValues();
    } else {
      this._clearSelection(option.value == null ? undefined : option);

      if (option.value == null) {
        this._propagateChanges(option.value);
      } else {
        this._selectionModel.select(option);
      }
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        const selectIndex = this.options.toArray().indexOf(this._selectionModel.selected[0]);
        this._keyManager.setActiveItem(selectIndex);
      }
    }
  }

  private _scrollActiveOptionIntoView() {
    const activeOption = this._keyManager.activeItem || this.options.first;

    if (!activeOption) {
      return;
    }

    const panelScrollTop = this.paneElement.nativeElement.scrollTop;
    const panelScrollBottom = panelScrollTop + this.paneElement.nativeElement.offsetHeight;

    if (panelScrollBottom === 0) {
      this.paneElement.nativeElement.scrollTop = activeOption.getOffsetTop();
    } else if (activeOption.getOffsetTop() < panelScrollTop) {
      // 当活动选项超出 panel 的顶部范围时，重新设置 panel 可视区域。
      this.paneElement.nativeElement.scrollTop = activeOption.getOffsetTop();
    } else if (activeOption.getOffsetTop() + activeOption.getOffsetHeight() >= panelScrollBottom) {
      // 当活动选项超出 panel 的底部范围时，重新设置 panel 可视区域。
      const scrollOffset = this.paneElement.nativeElement.offsetHeight - activeOption.getOffsetHeight();
      this.paneElement.nativeElement.scrollTop = activeOption.getOffsetTop() - scrollOffset;
    }
  }
}
