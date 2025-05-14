import { Subscription } from 'rxjs';

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NC_OPTION_PARENT, NcOption } from '@oceanstar/components/core';

let _uniqueIdCounter = 0;

export class NcAutocompleteSelectedEvent {
  constructor(
    public source: NcAutocomplete,
    public option: NcOption,
  ) {}
}

export interface NcAutocompleteActivatedEvent {
  /** */
  source: NcAutocomplete;

  /** */
  option: NcOption | null;
}

export interface NcAutocompleteDefaultOptions {
  autoActiveFirstOption?: boolean;
}

export const NC_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken<NcAutocompleteDefaultOptions>('nc-autocomplete-default-options', {
  providedIn: 'root',
  factory: NC_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});

export function NC_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): NcAutocompleteDefaultOptions {
  return { autoActiveFirstOption: false };
}

@Component({
  imports: [CommonModule],
  selector: 'nc-autocomplete',
  templateUrl: 'autocomplete.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'ncAutocomplete',
  host: {
    class: 'nc-autocomplete',
  },
  providers: [{ provide: NC_OPTION_PARENT, useExisting: NcAutocomplete }],
})
export class NcAutocomplete implements AfterContentInit, OnDestroy {
  private _activeOptionChanges = Subscription.EMPTY;

  _keyManager!: ActiveDescendantKeyManager<NcOption>;

  showPanel: boolean = false;

  _isOpen: boolean = false;

  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }

  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<any>;

  @ViewChild('panel') panel!: ElementRef;

  @ContentChildren(NcOption, { descendants: true }) options!: QueryList<NcOption>;

  @Input() displayWith: ((value: any) => string) | null = null;

  private _autoActiveFirstOption: boolean;

  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: BooleanInput) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }

  @Input() panelWidth!: string | number;

  @Output() readonly optionSelected = new EventEmitter<NcAutocompleteSelectedEvent>();

  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  @Output() readonly optionActivated = new EventEmitter<NcAutocompleteActivatedEvent>();

  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      this._classList = value.split(' ').reduce(
        (classList, className) => {
          classList[className.trim()] = true;
          return classList;
        },
        {} as { [key: string]: boolean },
      );
    } else {
      this._classList = {};
    }

    this._setVisibilityClasses(this._classList);
    this._elementRef.nativeElement.className = '';
  }
  _classList: { [key: string]: boolean } = {};

  id: string = `nc-autocomplete-${_uniqueIdCounter++}`;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(NC_AUTOCOMPLETE_DEFAULT_OPTIONS) defaults: NcAutocompleteDefaultOptions,
  ) {
    this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
  }

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<NcOption>(this.options).withWrap();
    this._activeOptionChanges = this._keyManager.change.subscribe(index => {
      this.optionActivated.emit({ source: this, option: this.options.toArray()[index] || null });
    });

    this._setVisibility();
  }

  ngOnDestroy() {
    this._activeOptionChanges.unsubscribe();
  }

  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  _setVisibility() {
    this.showPanel = !!this.options.length;
    this._setVisibilityClasses(this._classList);
    this._changeDetectorRef.markForCheck();
  }

  _emitSelectEvent(option: NcOption): void {
    const event = new NcAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }

  private _setVisibilityClasses(classList: { [key: string]: boolean }) {
    classList['nc-autocomplete-visible'] = this.showPanel;
    classList['nc-autocomplete-hidden'] = !this.showPanel;
  }

  static ngAcceptInputType_autoActiveFirstOption: BooleanInput;
  static ngAcceptInputType_disableRipple: BooleanInput;
}
