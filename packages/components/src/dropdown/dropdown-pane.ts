import { Observable, Subject, Subscription } from 'rxjs';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ContentObserver } from '@angular/cdk/observers';
import {
  AfterContentInit,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NcOverlay } from '@oceanstar/components/overlay';

export declare type NcDropdownPaneSize = '' | 'tiny' | 'small' | 'large';

export interface NcDropdownParent {
  overlay: NcOverlay;
}

export const NC_DROPDOWN_PARENT = new InjectionToken<NcDropdownParent>('nc-dropdown-parent');

@Component({
  selector: 'nc-dropdown-pane, [nc-dropdown-pane]',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-dropdown-pane',
    '[class.autosize]': 'autosize',
  },
})
export class NcDropdownPane implements AfterContentInit, OnDestroy {
  private _contentSubscription!: Subscription;

  private _arrow = false;

  private _autosize = false;

  @Input() size: NcDropdownPaneSize = 'small';

  @Input()
  get autosize() {
    return this._autosize;
  }
  set autosize(value: BooleanInput) {
    this._autosize = coerceBooleanProperty(value);
  }

  @Input()
  get arrow() {
    return this._arrow;
  }
  set arrow(value: BooleanInput) {
    this._arrow = coerceBooleanProperty(value);
  }

  private _contentChange = new Subject();

  get contentChanged(): Observable<any> {
    return this._contentChange.asObservable();
  }

  get textContent(): string {
    return (this._elementRef.nativeElement.textContent || '').trim();
  }

  constructor(
    private _contentObserver: ContentObserver,
    private _elementRef: ElementRef,
    @Inject(NC_DROPDOWN_PARENT) private _parent: NcDropdownParent,
  ) {}

  ngAfterContentInit() {
    this._contentSubscription = this._contentObserver
      .observe(this._elementRef)
      .subscribe(() => this._checkContentChange());
  }

  ngOnDestroy() {
    if (this._contentSubscription) {
      this._contentSubscription.unsubscribe();
    }
  }

  private _checkContentChange() {
    if (this._parent.overlay.opened) {
      this._parent.overlay.forceUpdatePosition();
    }
  }
}
