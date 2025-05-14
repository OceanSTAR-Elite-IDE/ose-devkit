import { Subscription, SubscriptionLike } from 'rxjs';
import { debounceTime, delay, filter, switchMap, take } from 'rxjs/operators';

import { AnimationEvent, transition, trigger } from '@angular/animations';
import { BooleanInput, coerceArray, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedOverlayPositionChange, ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fadeIn, fadeOut, fromOutsideClick } from '@oceanstar/components/core';

import { getPositionClassName, NC_OVERLAY_POSITION_PAIRS, NcOverlayPosition } from './overlay-positions';

@Component({
  imports: [CommonModule, OverlayModule],
  selector: 'nc-overlay, [nc-overlay]',
  templateUrl: 'overlay.html',
  animations: [trigger('fade', [transition('void => *', fadeIn(0.15)), transition('* => void', fadeOut(0.15))])],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NcOverlay implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  private _destroyRef = inject(DestroyRef);

  private _debounceClose = new EventEmitter<void>();

  private _positionChange = new EventEmitter<string>();

  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  private _outsideClickSubscription!: Subscription | null;

  private _opened = false;

  get opened() {
    return this._opened;
  }

  private _markClosed = true;

  private _origin!: CdkOverlayOrigin;

  @Input()
  set origin(value: CdkOverlayOrigin) {
    this._origin = value;
  }
  get origin() {
    return this._origin;
  }

  private _position: NcOverlayPosition | string = NcOverlayPosition.BottomLeft;

  @Input()
  set position(value: NcOverlayPosition | string) {
    if (value) {
      this._position = value;
      this._positionPairs = NC_OVERLAY_POSITION_PAIRS[value];
    } else {
      this._position = NcOverlayPosition.BottomLeft;
    }
  }

  private _positionPairs: ConnectionPositionPair[] = NC_OVERLAY_POSITION_PAIRS[this._position];

  @Input()
  get positionPairs() {
    return this._positionPairs;
  }
  set positionPairs(value: ConnectionPositionPair[]) {
    this._positionPairs = coerceArray(value);
  }

  private _paddingClass = getPositionClassName(this._positionPairs[0]);

  get paddingClass() {
    return this._paddingClass;
  }

  private _fixed = false;

  @Input()
  get fixed() {
    return this._fixed;
  }
  set fixed(value: BooleanInput) {
    this._fixed = coerceBooleanProperty(value);
  }

  private _arrow = false;

  @Input()
  get arrow() {
    return this._arrow;
  }
  set arrow(value: BooleanInput) {
    this._arrow = coerceBooleanProperty(value);
  }

  private _nospacing = false;

  @Input()
  get nospacing() {
    return this._nospacing;
  }
  set nospacing(value: BooleanInput) {
    this._nospacing = coerceBooleanProperty(value);
  }

  private _overlayClass = '';

  @Input()
  get overlayClass() {
    return this._overlayClass;
  }
  set overlayClass(value: string) {
    this._overlayClass = value;
  }

  private _backdrop = false;

  @Input()
  get backdrop() {
    return this._backdrop;
  }
  set backdrop(value: BooleanInput) {
    this._backdrop = coerceBooleanProperty(value);
  }

  @ViewChild(CdkConnectedOverlay, { static: true }) cdkConnectedOverlay!: CdkConnectedOverlay;

  @Output() afterOpen = new EventEmitter<void>();
  @Output() afterClosed = new EventEmitter<void>();

  @Output() beforeOpen = new EventEmitter<void>();
  @Output() beforeClosed = new EventEmitter<void>();

  @Output() overlayEnter = new EventEmitter<any>();
  @Output() overlayLeave = new EventEmitter<any>();

  @Output() positionChange = new EventEmitter<ConnectedOverlayPositionChange>();

  @Output() keydownEvents = new EventEmitter<KeyboardEvent>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() location: Location,
  ) {
    if (location) {
      this._locationChanges = location.subscribe(() => this.close());
    }
  }

  ngOnInit() {
    // 去抖动关闭事件，有时被动触发关闭事件造成跟预计效果不同的现象，
    // 这可以支持你 "反悔" 关闭事件的触发（100毫米内，可以通过设置 _markClosed = false 来防止）
    this._debounceClose
      .pipe(
        debounceTime(100),
        filter(() => this._markClosed),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.close());

    this._positionChange
      .pipe(
        filter(position => position !== this._paddingClass),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(position => (this._paddingClass = position));
  }

  ngAfterViewInit() {
    this.cdkConnectedOverlay.attach
      .pipe(
        take(1),
        switchMap(() => this.cdkConnectedOverlay.overlayRef.keydownEvents()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(event => {
        if (event.keyCode === ESCAPE) {
          this.close();
        }
        this.keydownEvents.next(event);
      });

    // 外部点击事件的主体是 body 元素，这会导致订阅之后 body 参数会接收冒泡传递的事件
    // 这与订阅意图不同，因此延迟到下一个事件队列开始订阅
    this.cdkConnectedOverlay.attach.pipe(delay(0), takeUntilDestroyed(this._destroyRef)).subscribe(() => this._subscribeOutsideClickEvent());

    this.cdkConnectedOverlay.detach.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._unsubscribeOutsideClickEvent());
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['position'] || changes['fixed'] || changes['positionPairs'];
    if (change && !change.firstChange) {
      this._setPosition();
    }
  }

  ngOnDestroy() {
    this._locationChanges.unsubscribe();
  }

  open() {
    this._opened = true;
    this._markClosed = false;
    this._changeDetectorRef.markForCheck();
  }

  close() {
    this._opened = false;
    this._markClosed = true;
    this._changeDetectorRef.markForCheck();
  }

  //
  toggle() {
    this.opened ? this.close() : this.open();
  }

  markOpen() {
    this.open();
  }

  markClose() {
    this._markClosed = true;
    this._debounceClose.next();
  }

  forceUpdatePosition() {
    if (this.opened) {
      this.cdkConnectedOverlay.overlayRef?.updatePosition();
    }
  }

  onAnimationStart(event: AnimationEvent): void {
    if (event.toState === null) {
      this.beforeOpen.next();
    } else if (event.toState === 'void') {
      this.beforeClosed.next();
    }
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === null) {
      this.afterOpen.next();
    } else if (event.toState === 'void') {
      this.afterClosed.next();
    }
  }

  onOverlayPositionChange(event: ConnectedOverlayPositionChange) {
    this._positionChange.next(getPositionClassName(event.connectionPair));
  }

  private _setPosition() {
    this._positionPairs = this.fixed ? this._positionPairs.slice(0, 1) : this._positionPairs;

    this._paddingClass = getPositionClassName(this._positionPairs[0]);
  }

  /** 开始外部点击事件的订阅 */
  private _subscribeOutsideClickEvent() {
    if (!this._outsideClickSubscription) {
      this._outsideClickSubscription = fromOutsideClick([this.cdkConnectedOverlay.overlayRef.overlayElement, this.origin.elementRef.nativeElement])
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => this.close());
    }
  }

  /** 取消外部点击事件的订阅 */
  private _unsubscribeOutsideClickEvent() {
    if (this._outsideClickSubscription) {
      this._outsideClickSubscription.unsubscribe();
      this._outsideClickSubscription = null;
    }
  }
}
