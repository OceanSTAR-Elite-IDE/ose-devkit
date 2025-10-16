import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';

import { _DisposeViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import {
  CDK_TABLE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  RowOutlet,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { CssMonitor, DateAdapter } from '@oceanstar/components/core';

import { NcGanttCalendar } from './calendar';
import { NcGanttCalendarAdapter } from './calendar-adapter';
import { NC_GANTT_CONTAINER, NcGanttCalendarType, NcGanttContainer } from './container';
import { NcGanttTableRowDef, NcGanttTimelineRowDef } from './row';

/**
 * 提供表格数据行容器的入口点
 */
@Directive({
  selector: '[ncGanttTableRowOutlet]',
})
export class NcGanttTableRowOutlet extends DataRowOutlet {}

/**
 * 提供表格表头容器的入口点
 */
@Directive({
  selector: '[ncGanttTableHeaderOutlet]',
})
export class NcGanttTableHeaderOutlet extends HeaderRowOutlet {}

/**
 * 为Timeline行提供一个outlet
 */
@Directive({
  selector: '[ncTimelineRowOutlet]',
})
export class NcGanttTimelineRowOutlet implements RowOutlet {
  viewContainer = inject(ViewContainerRef);
  elementRef = inject(ElementRef);

  constructor() {
    const table = inject(NcGantt);
    table._timelineRowOutlet = this;
  }
}

/**
 * 甘特图组件
 */
@Component({
  imports: [NcGanttTableHeaderOutlet, NcGanttTableRowOutlet, NcGanttTimelineRowOutlet, NcGanttCalendar, NoDataRowOutlet, FooterRowOutlet],
  selector: 'nc-gantt',
  exportAs: 'ncGanttTable',
  template: `
    <div class="nc-gantt-table-container" #tableContainer>
      <div class="nc-gantt-table" [style.width]="_hasResized ? tableWidth + 'px' : 'auto'" #table>
        <div class="nc-gantt-table-header" [style.height]="_calendarHeight">
          <ng-container ncGanttTableHeaderOutlet />
        </div>
        <div class="nc-gantt-table-body">
          <ng-container ncGanttTableRowOutlet />
          <ng-container noDataRowOutlet />
          <ng-container footerRowOutlet />
        </div>
      </div>
      <div class="nc-gantt-resizer" #resizer></div>
    </div>
    <div class="nc-gantt-timeline">
      <nc-gantt-calendar />
      <div class="nc-gantt-timeline-body">
        <ng-container ncTimelineRowOutlet />
      </div>
    </div>
  `,
  styleUrls: ['./gantt.css'],
  host: {
    class: 'nc-gantt',
    '[class.nc-gantt-daily]': 'calendarType === "daily"',
    '[class.nc-gantt-weekly]': 'calendarType === "weekly"',
    '[class.nc-gantt-monthly]': 'calendarType === "monthly"',
    '[class.resizing]': 'isResizing',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    { provide: CdkTable, useExisting: NcGantt },
    { provide: CDK_TABLE, useExisting: NcGantt },
    { provide: NC_GANTT_CONTAINER, useExisting: NcGantt },
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
    NcGanttCalendarAdapter,
  ],
})
export class NcGantt<T, D> extends CdkTable<T> implements OnInit, OnChanges, AfterViewInit, AfterContentInit, NcGanttContainer<D> {
  // 是否正在拖拽滚动
  private isDragging = false;
  // 上次鼠标位置
  private lastX = 0;
  private lastY = 0;
  // 拖拽开始时的鼠标X坐标
  private resizeStartX = 0;
  // 拖拽开始时的表格宽度
  private resizeStartWidth = 0;

  private _dateAdapter: DateAdapter<D> = inject(DateAdapter);

  // 是否已经进行过拖拽调整
  _hasResized = false;

  elementRef = inject(ElementRef);
  renderer = inject(Renderer2);

  _calendarHeight: any;
  tableWidth = 0; // Will be used only during resizing
  isResizing = false;

  @Input() calendarType: NcGanttCalendarType = 'daily';

  private _minDate!: D;

  @Input()
  get minDate(): D {
    return this._minDate;
  }
  set minDate(value: D) {
    this._minDate = this._dateAdapter.createDate(this._dateAdapter.getYear(value), this._dateAdapter.getMonth(value), 1);
  }

  private _maxDate!: D;

  @Input()
  get maxDate(): D {
    return this._maxDate;
  }
  set maxDate(value: D) {
    this._maxDate = this._dateAdapter.createDate(
      this._dateAdapter.getYear(value),
      this._dateAdapter.getMonth(value),
      this._dateAdapter.getNumDaysInMonth(value),
    );
  }

  // 表格的最小宽度
  @Input() minTableWidth = 300;

  // 表格的最大宽度（百分比）
  @Input() maxTableWidth = 80;

  // 是否启用拖拽滚动
  @Input() enableDragScroll = true;

  private _dataChange = new BehaviorSubject<{ minDate: D; maxDate: D; calendarType: NcGanttCalendarType }>({
    minDate: this.minDate,
    maxDate: this.maxDate,
    calendarType: this.calendarType,
  });

  get dataChange() {
    return this._dataChange.asObservable();
  }

  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  @ViewChild('resizer', { static: true }) resizer!: ElementRef;
  @ViewChild('table', { static: true }) table!: ElementRef;

  @ContentChildren(NcGanttTableRowDef, { descendants: true }) declare _contentRowDefs: QueryList<NcGanttTableRowDef<T>>;

  @ContentChildren(NcGanttTimelineRowDef, { descendants: true }) declare _contentTimelineRowDefs: QueryList<NcGanttTimelineRowDef<T>>;

  private _cssMonitor = inject(CssMonitor);

  private _cssWatcherSubscription!: Subscription;

  // 输出容器实例
  _timelineRowOutlet: NcGanttTimelineRowOutlet = null!;

  @ViewChild(NcGanttCalendar, { static: true }) calendar!: NcGanttCalendar<D>;

  /** 存储Timeline行定义 */
  private _timelineRowDefs: NcGanttTimelineRowDef<T>[] = [];

  override ngOnInit() {
    super.ngOnInit();
    // 初始化不预设固定宽度，会在模板中使用auto
  }

  ngOnChanges(changes: SimpleChanges): void {
    let shouldNotify = false;

    // 检查日期顺序
    if ((changes['minDate'] || changes['maxDate']) && this._minDate && this._maxDate) {
      // 确保maxDate大于minDate，如果不是则交换
      if (this._dateAdapter.compareDate(this._maxDate, this._minDate) < 0) {
        const temp = this._minDate;
        this._minDate = this._maxDate;
        this._maxDate = temp;
        shouldNotify = true;
      }

      // 检查日期部分是否真的改变了（忽略时间部分）
      if (changes['minDate']) {
        const oldValue = changes['minDate'].previousValue;
        const newValue = changes['minDate'].currentValue;

        if (oldValue && newValue) {
          // 比较年月日是否相同，如果不同则认为发生了变化
          shouldNotify = shouldNotify || !this._isSameDay(oldValue, newValue);
        } else {
          // 如果之前没有值或现在没有值，则认为发生了变化
          shouldNotify = true;
        }
      }

      if (changes['maxDate']) {
        const oldValue = changes['maxDate'].previousValue;
        const newValue = changes['maxDate'].currentValue;

        if (oldValue && newValue) {
          // 比较年月日是否相同，如果不同则认为发生了变化
          shouldNotify = shouldNotify || !this._isSameDay(oldValue, newValue);
        } else {
          // 如果之前没有值或现在没有值，则认为发生了变化
          shouldNotify = true;
        }
      }
    }

    // 检查日历类型变化
    if (changes['calendarType'] && !changes['calendarType'].firstChange) {
      const oldValue = changes['calendarType'].previousValue;
      const newValue = changes['calendarType'].currentValue;

      // 只有当日历类型真正改变时才发出通知
      if (oldValue !== newValue) {
        shouldNotify = true;
      }
    }

    // 只有当有真正变化时才发出通知
    if (shouldNotify) {
      this._dataChange.next({ minDate: this._minDate, maxDate: this._maxDate, calendarType: this.calendarType });
    }
  }

  ngAfterViewInit() {
    this._cssWatcherSubscription = this._cssMonitor.watchAllCssChanges(this.elementRef.nativeElement).subscribe(css => {
      this._calendarHeight = this.calendar.getHeight();
    });

    this.setupResizerEvents();
    this.setupDragScrollEvents();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    this._calendarHeight = this.calendar.getHeight();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this._cssWatcherSubscription) {
      this._cssWatcherSubscription.unsubscribe();
    }

    this._dataChange.complete();
    this._dataChange.unsubscribe();
  }

  /** 缓存Timeline行定义 */
  private _cacheTimelineRowDefs() {
    this._timelineRowDefs = [];
    // 从ContentChildren获取Timeline行定义
    if (this._contentTimelineRowDefs) {
      this._contentTimelineRowDefs.forEach(def => {
        if (!def._table || def._table === this) {
          this._timelineRowDefs.push(def);
        }
      });
    }
  }

  /** 在CdkTable渲染后更新Timeline行 */
  updateTimelineRows() {
    // 缓存Timeline行定义
    this._cacheTimelineRowDefs();

    // 渲染Timeline行
    if (this._timelineRowDefs.length > 0) {
      this._forceRenderTimelineRows();
    }
  }

  /** 从_data中获取数据并更新所有行 */
  override renderRows() {
    // 调用父类的renderRows方法
    super.renderRows();
    // 更新Timeline行
    this.updateTimelineRows();
  }

  /** 渲染Timeline行 */
  private _renderTimelineRow(timelineDef: NcGanttTimelineRowDef<T>, index: number, data: T) {
    if (!this._timelineRowOutlet) return null;

    // 创建与CdkTable相同结构的上下文
    const context = {
      $implicit: data,
      index,
      count: this._data?.length || 0,
      first: index === 0,
      last: index === (this._data?.length || 0) - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
    };

    const viewRef = this._timelineRowOutlet.viewContainer.createEmbeddedView(timelineDef.template, context, index);

    return viewRef;
  }

  /** 强制重新渲染Timeline行 */
  private _forceRenderTimelineRows() {
    // 清除Timeline行outlet中的所有现有内容
    if (this._timelineRowOutlet && this._timelineRowOutlet.viewContainer.length > 0) {
      this._timelineRowOutlet.viewContainer.clear();
    }

    // 确保有数据和行定义
    if (!this._timelineRowOutlet || this._timelineRowDefs.length === 0 || !this._data || this._data.length === 0) {
      return;
    }

    // 获取第一个Timeline行定义 (通常只有一个)
    const timelineDef = this._timelineRowDefs[0];

    // 为每个数据项渲染一个Timeline行
    this._data.forEach((item, index) => {
      this._renderTimelineRow(timelineDef, index, item);
    });
  }

  // override _outletAssigned(): void {
  //   super._outletAssigned();
  // }

  private setupResizerEvents() {
    const resizer = this.resizer.nativeElement;

    // 监听鼠标按下事件开始拖动
    fromEvent<MouseEvent>(resizer, 'mousedown').subscribe((e: MouseEvent) => {
      e.preventDefault();
      this.startResize(e);
    });

    // 触摸设备支持
    fromEvent<TouchEvent>(resizer, 'touchstart').subscribe((e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        this.startResize(e.touches[0]);
      }
    });
  }

  private startResize(event: MouseEvent | Touch) {
    this.isResizing = true;

    // 存储初始鼠标位置和表格宽度
    this.resizeStartX = event instanceof MouseEvent ? event.clientX : event.clientX;
    this.resizeStartWidth = this.table.nativeElement.offsetWidth;

    // 初始化当前宽度
    this.tableWidth = this.resizeStartWidth;

    const ganttWidth = this.elementRef.nativeElement.offsetWidth;
    const maxWidthPx = ganttWidth * (this.maxTableWidth / 100);

    // 添加移动和结束事件监听器
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isResizing) return;

      const clientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : (moveEvent as TouchEvent).touches[0].clientX;

      // 计算鼠标移动的距离
      const deltaX = clientX - this.resizeStartX;

      // 根据初始宽度和鼠标移动距离计算新宽度
      let newWidth = this.resizeStartWidth + deltaX;

      // 确保宽度在最小宽度和最大宽度之间
      newWidth = Math.max(this.minTableWidth, Math.min(newWidth, maxWidthPx));

      this.tableWidth = newWidth;
      this.renderer.addClass(this.elementRef.nativeElement, 'resizing');

      // 标记已经发生过拖拽调整
      this._hasResized = true;
    };

    const endHandler = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', moveHandler as EventListener);
      document.removeEventListener('touchmove', moveHandler as EventListener);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchend', endHandler);
      this.renderer.removeClass(this.elementRef.nativeElement, 'resizing');
    };

    document.addEventListener('mousemove', moveHandler as EventListener);
    document.addEventListener('touchmove', moveHandler as EventListener);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchend', endHandler);
  }

  /**
   * 设置拖拽滚动的事件监听器
   */
  private setupDragScrollEvents() {
    // 如果拖拽滚动功能被禁用，则不添加事件监听
    if (!this.enableDragScroll) return;

    // 获取timeline-body元素
    const timelineBody = this.elementRef.nativeElement.querySelector('.nc-gantt-timeline-body');
    if (!timelineBody) return;

    // 监听鼠标按下事件
    fromEvent<MouseEvent>(timelineBody, 'mousedown').subscribe((e: MouseEvent) => {
      // 只有当左键点击时才触发拖拽
      if (e.button !== 0) return;

      // 防止选中文本
      e.preventDefault();
      this.startDragScroll(e);
    });

    // 触摸设备支持
    fromEvent<TouchEvent>(timelineBody, 'touchstart').subscribe((e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        this.startDragScroll(e.touches[0]);
      }
    });
  }

  /**
   * 开始拖拽滚动
   */
  private startDragScroll(event: MouseEvent | Touch) {
    this.isDragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    // 修改鼠标样式
    this.renderer.addClass(this.elementRef.nativeElement, 'dragging');

    // 添加移动和结束事件监听器
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;

      const clientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : (moveEvent as TouchEvent).touches[0].clientX;
      const clientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : (moveEvent as TouchEvent).touches[0].clientY;

      // 计算移动距离
      const deltaX = this.lastX - clientX;
      const deltaY = this.lastY - clientY;

      // 更新滚动位置
      this.elementRef.nativeElement.scrollLeft += deltaX;
      this.elementRef.nativeElement.scrollTop += deltaY;

      // 更新上次位置
      this.lastX = clientX;
      this.lastY = clientY;

      // 阻止默认行为和事件冒泡
      if (moveEvent instanceof MouseEvent) {
        moveEvent.preventDefault();
        moveEvent.stopPropagation();
      }
    };

    const endHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', moveHandler as EventListener);
      document.removeEventListener('touchmove', moveHandler as EventListener);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchend', endHandler);

      // 恢复鼠标样式
      this.renderer.removeClass(this.elementRef.nativeElement, 'dragging');
    };

    document.addEventListener('mousemove', moveHandler as EventListener);
    document.addEventListener('touchmove', moveHandler as EventListener);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchend', endHandler);
  }

  /**
   * 比较两个日期的年月日部分是否相同，忽略时间部分
   * @param date1 第一个日期
   * @param date2 第二个日期
   * @returns 如果年月日都相同返回true，否则返回false
   */
  private _isSameDay(date1: D, date2: D): boolean {
    return (
      this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2) &&
      this._dateAdapter.getMonth(date1) === this._dateAdapter.getMonth(date2) &&
      this._dateAdapter.getDate(date1) === this._dateAdapter.getDate(date2)
    );
  }
}
