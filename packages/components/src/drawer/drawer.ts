import { Subscription } from 'rxjs';

import { AnimationEvent, transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Inject,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  fromOutsideClick,
  fromOutsideTouch,
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideOutDown,
  slideOutLeft,
  slideOutRight,
  slideOutUp,
} from '@oceanstar/components/core';
import { NcDrawerContainer } from './drawer-container';
import { NC_DRAWER_CONTAINER } from './drawer-container';

export declare type NcDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

const ANIMATION_TIMING = 0.4;

let uniqueId = 0;
/**
 * `NcDrawerComponent` 提供了一个可拖拽、可从多方向滑入滑出的抽屉组件。
 * 支持配置抽屉的显示位置、是否显示背景遮罩、是否为静态模式以及是否支持触摸模式。
 * 可以通过事件和输入属性来控制抽屉的打开、关闭以及状态改变。
 */
@Component({
  // 组件的基本信息，包括选择器、模板、封装方式和动画等。
  selector: 'nc-drawer',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // 定义抽屉的滑入滑出动画。
    trigger('slide', [
      // 定义从四个方向滑入和滑出的过渡动画。
      transition('closed => left', slideInLeft(ANIMATION_TIMING)),
      transition('closed => right', slideInRight(ANIMATION_TIMING)),
      transition('closed => top', slideInUp(ANIMATION_TIMING)),
      transition('closed => bottom', slideInDown(ANIMATION_TIMING)),
      transition('left => closed', slideOutLeft(ANIMATION_TIMING)),
      transition('right => closed', slideOutRight(ANIMATION_TIMING)),
      transition('top => closed', slideOutUp(ANIMATION_TIMING)),
      transition('bottom => closed', slideOutDown(ANIMATION_TIMING)),
    ]),
  ],
  host: {
    // 定义组件的类和属性绑定，包括动画状态和自定义类。
    class: 'nc-drawer',
    '[class.opened]': 'state !== "closed"',
    '[class.backdrop]': 'backdrop',
    '[class.static]': 'static',
    '[@slide]': 'state',
    '(@slide.start)': 'onAnimationStart($event)',
    '(@slide.done)': 'onAnimationDone($event)',
  },
})
export class NcDrawerComponent implements AfterViewInit, OnDestroy {
  // 组件的唯一标识符。
  readonly id: string = `nc-drawer-${uniqueId++}`;

  // 销毁时的引用。
  private _destroyRef = inject(DestroyRef);

  // 订阅外部点击或触摸事件的订阅对象。
  private _outsideActionSubscription!: Subscription | null;

  // 抽屉容器元素的引用。
  private _container!: Element;

  // 背景遮罩元素的引用。
  private _backdropElement!: Element | null;

  // 是否显示背景遮罩。
  private _backdrop = false;

  /**
   * backdrop 输入属性，用于控制是否显示背景遮罩。
   * @param value 输入值，用于设置是否显示遮罩。
   */
  @Input()
  get backdrop() {
    return this._backdrop;
  }
  set backdrop(value: BooleanInput) {
    this._backdrop = coerceBooleanProperty(value);
    if (this._backdrop) {
      this._createBackdropOverlay(); // 创建背景遮罩
    } else {
      this._removeBackdropOverlay(); // 移除背景遮罩
    }
  }

  // 抽屉的显示位置。
  private _placement!: NcDrawerPlacement;

  /**
   * placement 输入属性，用于设置抽屉的显示位置。
   * @param value 输入值，指定抽屉的显示位置。
   */
  @Input()
  get placement() {
    return this._placement;
  }
  set placement(value: NcDrawerPlacement) {
    this._changePlacementAndStyles(value); // 根据位置设置样式
  }

  // 是否开启触摸模式。
  private _touchmode: boolean = false;

  /**
   * touchmode 输入属性，用于设置是否开启触摸模式。
   * @param value 输入值，指定是否开启触摸模式。
   */
  @Input()
  get touchmode() {
    return this._touchmode;
  }
  set touchmode(value: BooleanInput) {
    this._touchmode = coerceBooleanProperty(value);
  }

  // 是否为静态模式。
  private _static: boolean = false;

  /**
   * static 输入属性，用于设置是否为静态模式。
   * @param value 输入值，指定是否为静态模式。
   */
  @Input()
  get static() {
    return this._static;
  }
  set static(value: BooleanInput) {
    this._static = coerceBooleanProperty(value);
    this._changeStaticMode(); // 根据静态模式设置样式
  }

  // 抽屉的当前状态（关闭或某个方向打开）。
  state: 'closed' | NcDrawerPlacement = 'closed';

  // 抽屉完全打开后的回调事件。
  @Output() afterOpen = new EventEmitter<any>();

  // 抽屉完全关闭后的回调事件。
  @Output() afterClosed = new EventEmitter<any>();

  // 抽屉开始打开前的回调事件。
  @Output() beforeOpen = new EventEmitter<any>();

  // 抽屉开始关闭前的回调事件。
  @Output() beforeClosed = new EventEmitter<any>();

  /**
   * 构造函数，初始化组件的基本设置。
   * @param _element ElementRef，组件的元素引用。
   * @param _renderer Renderer2，用于对组件进行渲染操作。
   * @param _platformId PLATFORM_ID，用于判断当前平台是否为浏览器环境。
   * @param container NcDrawerContainer，可选，抽屉的外部容器。
   */
  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Optional() @Inject(NC_DRAWER_CONTAINER) container: NcDrawerContainer,
  ) {
    if (isPlatformBrowser(_platformId)) {
      this._initContainerAndStyles(container); // 在浏览器环境中初始化容器和样式
    }
    this._changePlacementAndStyles('left'); // 默认抽屉从左侧滑出
  }

  // 组件的视图初始化后的生命周期钩子。
  ngAfterViewInit() {}

  // 组件销毁前的生命周期钩子。
  ngOnDestroy() {
    if (isPlatformBrowser(this._platformId)) {
      this._renderer.removeClass(this._container, `${this.id}-container`); // 移除容器的自定义类
    }
    this._unsubscribeOutsideActionEvent(); // 取消外部事件的订阅
  }

  /**
   * 打开抽屉。
   */
  open() {
    if (!this.static) {
      this.state = this.placement; // 非静态模式下打开抽屉
    }
  }

  /**
   * 关闭抽屉。
   * @param force boolean，是否强制关闭。默认为 false。
   */
  close(force: boolean = false) {
    if (!this.static || force) {
      this.state = 'closed'; // 当非静态模式或强制关闭时，关闭抽屉
    }
  }

  /**
   * 动画完成后的回调处理。
   * @param event AnimationEvent，动画事件对象。
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      return;
    }

    if (event.toState !== 'closed') {
      this._subscribeOutsideActionEvent(); // 打开抽屉时订阅外部事件
      this.afterOpen.emit(); // 抽屉完全打开后触发事件
    } else {
      this.afterClosed.emit(); // 抽屉完全关闭后触发事件
    }
  }

  /**
   * 动画开始时的回调处理。
   * @param event AnimationEvent，动画事件对象。
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      return;
    }

    if (event.toState === 'closed') {
      this._unsubscribeOutsideActionEvent(); // 关闭抽屉时取消外部事件的订阅
      this._disattachBackdropOverlay(); // 移除背景遮罩
      this.beforeClosed.emit(); // 抽屉开始关闭前Server timeout
    } else {
      this._attachBackdropOverlay();
      this.beforeOpen.emit();
    }
  }

  private _changeStaticMode() {
    if (this.static) {
      this.state = this.placement;
      this._renderer.addClass(this._container, 'nc-drawer-scrollblock');
    } else {
      this.state = 'closed';
      this._renderer.removeClass(this._container, 'nc-drawer-scrollblock');
    }
  }

  /** 调整方向的样式属性 */
  private _changePlacementAndStyles(placement: NcDrawerPlacement) {
    if (this._placement) {
      this._renderer.removeClass(this._element.nativeElement, this._placement);
    }
    this._renderer.addClass(this._element.nativeElement, (this._placement = placement));
  }

  /** 设置容器的样式 */
  private _initContainerAndStyles(container: NcDrawerContainer) {
    this._container = container ? container.element : document.body;
    if (this._container !== document.body) {
      this._renderer.addClass(this._element.nativeElement, 'nested');
    }
    this._renderer.addClass(this._container, `${this.id}-container`);
  }

  /** 创建遮罩层元素对象，当 backdrop 属性是 true 的时候才会创建 */
  private _createBackdropOverlay() {
    this._backdropElement = this._renderer.createElement('div');
    this._renderer.addClass(this._backdropElement, 'nc-drawer-backdrop');
    this._renderer.addClass(this._backdropElement, `${this.id}-backdrop`);
  }

  /** 删除遮罩层元素对象，当 backdrop 属性是 false 时会执行这一操作 */
  private _removeBackdropOverlay() {
    this._disattachBackdropOverlay();
    this._backdropElement = null;
  }

  /** 将创建好的遮罩层添加到 区域元素内（默认为 body 元素） */
  private _attachBackdropOverlay() {
    if (this.backdrop && this._backdropElement) {
      this._renderer.appendChild(this._container, this._backdropElement);
      this._renderer.addClass(this._container, 'nc-drawer-scrollblock');
    }
  }

  /** 将区域元素内（默认为 body 元素）的遮罩层移除 */
  private _disattachBackdropOverlay() {
    if (this._backdropElement) {
      this._renderer.removeChild(this._container, this._backdropElement);
      this._renderer.removeClass(this._container, 'nc-drawer-scrollblock');
    }
  }

  /** 开始外部事件的订阅 */
  private _subscribeOutsideActionEvent() {
    const outsideAction = this.touchmode ? fromOutsideTouch : fromOutsideClick;
    this._outsideActionSubscription = outsideAction([this._element.nativeElement], this._container)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(_ => this.close());
  }

  /** 取消外部事件的订阅 */
  private _unsubscribeOutsideActionEvent() {
    if (this._outsideActionSubscription) {
      this._outsideActionSubscription.unsubscribe();
      this._outsideActionSubscription = null;
    }
  }
}
