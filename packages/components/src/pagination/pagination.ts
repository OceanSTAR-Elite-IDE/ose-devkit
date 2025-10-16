import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NC_PAGINATION_CONFIG, NcPaginationConfig } from './pagination-config';

export const PAGINATION_ELLIPSIS = '...';

@Component({
  imports: [CommonModule],
  selector: 'nc-pagination',
  templateUrl: 'pagination.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-pagination -space-x-px rounded-md',
  },
})
export class NcPagination implements OnInit, OnChanges, AfterViewInit {
  private _totalPage = 1;

  get totalPage() {
    return this._totalPage;
  }

  private _pageItems: any[] = [1];

  get pageItems() {
    return this._pageItems;
  }

  private _defaultConfig = Object.assign(new NcPaginationConfig(), inject(NC_PAGINATION_CONFIG, { optional: true }));

  _itemSize: number = this._defaultConfig.itemSize;

  private _previousLabel: string = this._defaultConfig.previousLabel;

  @Input()
  set previousLabel(value: string) {
    this._previousLabel = value;
  }
  get previousLabel() {
    return this._previousLabel;
  }

  private _nextLabel: string = this._defaultConfig.nextLabel;

  @Input()
  set nextLabel(value: string) {
    this._nextLabel = value;
  }
  get nextLabel() {
    return this._nextLabel;
  }

  private _total = 0;

  @Input()
  set total(value: number) {
    this._total = coerceNumberProperty(value);
  }
  get total() {
    return this._total;
  }

  private _pageIndex = 1;

  @Input()
  set pageIndex(value: number) {
    this._pageIndex = coerceNumberProperty(value);
  }
  get pageIndex() {
    return this._pageIndex;
  }

  private _pageSizeSteps: number[] = [10, 20, 30, 50];

  @Input()
  set pageSizeSteps(value: number[]) {
    this._pageSizeSteps = value.map(item => coerceNumberProperty(item));
  }
  get pageSizeSteps() {
    return this._pageSizeSteps;
  }

  private _pageSize: number = this._pageSizeSteps[0];

  @Input()
  set pageSize(value: number) {
    this._pageSize = coerceNumberProperty(value);
  }
  get pageSize() {
    return this._pageSize;
  }

  private _pageSizeChangeable = false;

  @Input()
  set pageSizeChangeable(value: BooleanInput) {
    this._pageSizeChangeable = coerceBooleanProperty(value);
  }
  get pageSizeChangeable() {
    return this._pageSizeChangeable;
  }

  @Output() pageChange = new EventEmitter<number>();

  @Output() pageSizeChange = new EventEmitter<number>();

  @ViewChild('pageSizeSelector') pageSizeSelector?: ElementRef<HTMLSelectElement>;

  ngOnInit() {
    // 确保 pageSize 在 pageSizeSteps 中存在，否则使用第一个值
    if (!this.pageSizeSteps.includes(this.pageSize)) {
      this._pageSize = this.pageSizeSteps[0];
    }
    this._calcPageItems();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['total'] || changes['pageIndex'] || changes['pageSize'] || changes['pageSizeSteps'];
    if (change) {
      // 如果 pageSize 或 pageSizeSteps 发生变化，确保 pageSize 仍然有效
      if (changes['pageSize'] || changes['pageSizeSteps']) {
        if (!this.pageSizeSteps.includes(this.pageSize)) {
          this._pageSize = this.pageSizeSteps[0];
        }
      }
      this._calcPageItems();
    }
  }

  ngAfterViewInit(): void {
    // @TODO: pageSize 的 html 绑定在初始化时不会被正确设置
    // 因此直接使用 select 赋值的方式来处理这个问题
    if (this.pageSizeSelector && this.pageSizeSelector.nativeElement) {
      this.pageSizeSelector.nativeElement.value = `${this.pageSize}`;
    }
  }

  _pageSizeChange(event: Event) {
    this.pageSize = coerceNumberProperty((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(this.pageSize);
  }

  _pageChange(index: number) {
    this.pageIndex = coerceNumberProperty(index, 1);
    this.pageChange.emit(this.pageIndex);
  }

  _nextPage() {
    const newPage = Math.min(this.totalPage, this.pageIndex + 1);
    if (this.pageIndex !== newPage) {
      this.pageChange.emit((this.pageIndex = newPage));
    }
  }

  _previousPage() {
    const newPage = Math.max(1, this.pageIndex - 1);
    if (this.pageIndex !== newPage) {
      this.pageChange.emit((this.pageIndex = newPage));
    }
  }

  private _calcPageItems() {
    this._totalPage = Math.ceil(this.total / this.pageSize);

    let pageItems: any[] = [1];

    /** 当新的总页数少于原来的索引时将 */
    if (this.pageIndex > this._totalPage) {
      this._pageIndex = Math.max(this._totalPage, 1);
      // this.pageChange.emit(this.pageIndex);
    }

    if (this._totalPage > 1) {
      let [start, end] = [
        Math.max(this.pageIndex - this._itemSize, 2),
        Math.min(this.pageIndex + this._itemSize, this.totalPage - 1),
      ];

      if (start - 2 >= 1) {
        pageItems.push(PAGINATION_ELLIPSIS);
      }

      pageItems = pageItems.concat(
        Array(end - start + 1)
          .fill(start)
          .map((v, i) => v + i),
      );

      if (end + 2 <= this.totalPage) {
        pageItems.push(PAGINATION_ELLIPSIS);
      }

      if (this.totalPage > 1) {
        pageItems.push(this.totalPage);
      }
    }

    this._pageItems = pageItems;
  }
}
